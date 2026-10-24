import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  PieChart,
  TrendingUp,
  Percent,
  Search,
  Sparkles,
  UtensilsCrossed,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { MenuItem, MenuCategory, RecipeIngredient } from '../types/restaurant';

export const RecipeEscandalloView: React.FC = () => {
  const { menuItems, inventory, settings, updateMenuItem, addMenuItem } = useRestaurant();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem>(menuItems[0] || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewDishModalOpen, setIsNewDishModalOpen] = useState<boolean>(false);

  // New Dish Form
  const [newDishData, setNewDishData] = useState({
    code: '',
    name: '',
    category: 'Cortes & Parrilla' as MenuCategory,
    price: 25.0,
    description: '',
    station: 'parrilla' as any,
    active: true,
    recipe: [] as RecipeIngredient[],
  });

  // Calculate dish cost based on current inventory unit cost
  const getDishCost = (dish: MenuItem) => {
    return dish.recipe.reduce((acc, ing) => {
      const inv = inventory.find((i) => i.id === ing.inventoryItemId);
      if (!inv) return acc;
      return acc + inv.unitCost * ing.quantity;
    }, 0);
  };

  const currentDishCost = selectedMenuItem ? getDishCost(selectedMenuItem) : 0;
  const currentFoodCostPct = selectedMenuItem && selectedMenuItem.price > 0
    ? (currentDishCost / selectedMenuItem.price) * 100
    : 0;
  const currentMarginDollar = selectedMenuItem ? selectedMenuItem.price - currentDishCost : 0;
  const currentMarginPct = 100 - currentFoodCostPct;

  // Add ingredient to active dish
  const handleAddIngredient = (inventoryItemId: string) => {
    if (!selectedMenuItem) return;
    const inv = inventory.find((i) => i.id === inventoryItemId);
    if (!inv) return;

    const existing = selectedMenuItem.recipe.find((r) => r.inventoryItemId === inventoryItemId);
    let updatedRecipe: RecipeIngredient[];

    if (existing) {
      updatedRecipe = selectedMenuItem.recipe.map((r) =>
        r.inventoryItemId === inventoryItemId ? { ...r, quantity: r.quantity + 0.1 } : r
      );
    } else {
      updatedRecipe = [...selectedMenuItem.recipe, { inventoryItemId, quantity: 0.1 }];
    }

    const updatedDish = { ...selectedMenuItem, recipe: updatedRecipe };
    updateMenuItem(updatedDish);
    setSelectedMenuItem(updatedDish);
  };

  // Update ingredient quantity
  const handleUpdateQuantity = (inventoryItemId: string, newQty: number) => {
    if (!selectedMenuItem || newQty < 0) return;
    const updatedRecipe = selectedMenuItem.recipe
      .map((r) => (r.inventoryItemId === inventoryItemId ? { ...r, quantity: Number(newQty.toFixed(3)) } : r))
      .filter((r) => r.quantity > 0);

    const updatedDish = { ...selectedMenuItem, recipe: updatedRecipe };
    updateMenuItem(updatedDish);
    setSelectedMenuItem(updatedDish);
  };

  // Remove ingredient
  const handleRemoveIngredient = (inventoryItemId: string) => {
    if (!selectedMenuItem) return;
    const updatedRecipe = selectedMenuItem.recipe.filter((r) => r.inventoryItemId !== inventoryItemId);
    const updatedDish = { ...selectedMenuItem, recipe: updatedRecipe };
    updateMenuItem(updatedDish);
    setSelectedMenuItem(updatedDish);
  };

  // Update dish price
  const handleUpdatePrice = (newPrice: number) => {
    if (!selectedMenuItem || newPrice < 0) return;
    const updatedDish = { ...selectedMenuItem, price: newPrice };
    updateMenuItem(updatedDish);
    setSelectedMenuItem(updatedDish);
  };

  const filteredDishes = menuItems.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950">
      {/* LEFT: Dishes List */}
      <div className="w-80 md:w-96 border-r border-slate-800 bg-slate-900/60 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Menú & Fichas Técnicas</h3>
            <button
              onClick={() => setIsNewDishModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              Nuevo Plato
            </button>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar plato para costear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredDishes.map((dish) => {
            const cost = getDishCost(dish);
            const foodCostPct = dish.price > 0 ? (cost / dish.price) * 100 : 0;
            const isSelected = selectedMenuItem?.id === dish.id;

            return (
              <button
                key={dish.id}
                onClick={() => setSelectedMenuItem(dish)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/40 shadow-sm'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-xs text-white line-clamp-1">{dish.name}</span>
                  <span className="font-mono-numbers text-xs font-bold text-amber-400 shrink-0">
                    {settings.currencySymbol}
                    {dish.price.toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{dish.category}</span>
                  <span className="font-mono-numbers">
                    Costo: {settings.currencySymbol}
                    {cost.toFixed(2)} ({foodCostPct.toFixed(0)}%)
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Technical Escandallo Sheet for selected dish */}
      {selectedMenuItem ? (
        <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
          {/* Header of the Dish */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-4">
              {selectedMenuItem.image ? (
                <img
                  src={selectedMenuItem.image}
                  alt={selectedMenuItem.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-700 shadow-md shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                  <UtensilsCrossed className="w-7 h-7" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {selectedMenuItem.name}
                  </h2>
                  <span className="text-xs font-mono-numbers text-slate-400">
                    ({selectedMenuItem.code})
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                  {selectedMenuItem.description}
                </p>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                  <span>Categoría: {selectedMenuItem.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Estación: {selectedMenuItem.station.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Price Adjustment input */}
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <label className="text-[10px] text-slate-400 block font-semibold uppercase">
                  Precio de Venta Carta
                </label>
                <div className="flex items-center gap-1 text-base font-bold text-white font-mono-numbers">
                  <span>{settings.currencySymbol}</span>
                  <input
                    type="number"
                    step="0.5"
                    value={selectedMenuItem.price}
                    onChange={(e) => handleUpdatePrice(Number(e.target.value))}
                    className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Key Indicators (Cost, Food Cost %, Margen) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Costo Total Materia Prima</span>
              <div className="text-2xl font-bold font-mono-numbers text-white">
                {settings.currencySymbol}
                {currentDishCost.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Calculado desde insumos del almacén
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Food Cost % (Ratio de Alimento)</span>
              <div
                className={`text-2xl font-bold font-mono-numbers ${
                  currentFoodCostPct <= 30
                    ? 'text-emerald-400'
                    : currentFoodCostPct <= 35
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {currentFoodCostPct.toFixed(1)}%
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {currentFoodCostPct <= 30
                  ? 'Objetivo óptimo alcanzado (< 30%)'
                  : currentFoodCostPct <= 35
                  ? 'Aceptable para cortes nobles'
                  : 'Atención: Costo elevado'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Margen de Contribución Bruto</span>
              <div className="text-2xl font-bold font-mono-numbers text-amber-400">
                {settings.currencySymbol}
                {currentMarginDollar.toFixed(2)}
                <span className="text-xs text-slate-400 font-normal ml-2">
                  ({currentMarginPct.toFixed(1)}%)
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Ganancia directa por plato vendido
              </span>
            </div>
          </div>

          {/* Recipe Breakdown Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-sm space-y-0">
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                Desglose de Insumos & Escandallo (Porción x Plato)
              </h4>
              <span className="text-xs text-slate-400">
                {selectedMenuItem.recipe.length} ingredientes en receta
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">INSUMO ALMACÉN</th>
                  <th className="py-2.5 px-4 text-right">CANTIDAD / DOSIS</th>
                  <th className="py-2.5 px-4 text-right">COSTO UNITARIO INSUMO</th>
                  <th className="py-2.5 px-4 text-right">COSTO EN ESTE PLATO</th>
                  <th className="py-2.5 px-4 text-right">% DEL COSTO TOTAL</th>
                  <th className="py-2.5 px-4 text-center">ELIMINAR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {selectedMenuItem.recipe.map((ing) => {
                  const inv = inventory.find((i) => i.id === ing.inventoryItemId);
                  if (!inv) return null;
                  const itemCost = inv.unitCost * ing.quantity;
                  const pct = currentDishCost > 0 ? (itemCost / currentDishCost) * 100 : 0;

                  return (
                    <tr key={ing.inventoryItemId} className="hover:bg-slate-800/40 text-slate-300">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{inv.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono-numbers">
                          {inv.code} · Stock actual: {inv.currentStock} {inv.unit}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono-numbers">
                        <div className="flex items-center justify-end gap-1.5">
                          <input
                            type="number"
                            step="0.01"
                            value={ing.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(ing.inventoryItemId, Number(e.target.value))
                            }
                            className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right text-white font-mono-numbers focus:border-amber-400"
                          />
                          <span className="text-slate-400 text-xs w-6 text-left">{inv.unit}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono-numbers text-slate-400">
                        {settings.currencySymbol}
                        {inv.unitCost.toFixed(2)} / {inv.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-numbers font-bold text-amber-300">
                        {settings.currencySymbol}
                        {itemCost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-numbers text-slate-300">
                        {pct.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleRemoveIngredient(ing.inventoryItemId)}
                          className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Add ingredient row selector */}
            <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold shrink-0">
                Agregar Insumo a la Receta:
              </span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddIngredient(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecciona una materia prima del almacén...
                </option>
                {inventory
                  .filter((i) => !selectedMenuItem.recipe.some((r) => r.inventoryItemId === i.id))
                  .map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} ({inv.code}) - Costo: {settings.currencySymbol}
                      {inv.unitCost.toFixed(2)} / {inv.unit}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      ) : null}

      {/* NEW DISH MODAL */}
      {isNewDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Crear Nuevo Plato en Carta</h3>
              <button
                onClick={() => setIsNewDishModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addMenuItem(newDishData);
                setIsNewDishModalOpen(false);
              }}
              className="p-5 space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Código</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. PLT-11"
                    value={newDishData.code}
                    onChange={(e) => setNewDishData({ ...newDishData, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Categoría</label>
                  <select
                    value={newDishData.category}
                    onChange={(e) => setNewDishData({ ...newDishData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Entradas">Entradas</option>
                    <option value="Cortes & Parrilla">Cortes & Parrilla</option>
                    <option value="Pastas & Arroces">Pastas & Arroces</option>
                    <option value="Guarniciones">Guarniciones</option>
                    <option value="Coctelería & Vinos">Coctelería & Vinos</option>
                    <option value="Bebidas sin Alcohol">Bebidas sin Alcohol</option>
                    <option value="Postres de Autor">Postres de Autor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Nombre del Plato</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Ojo de Bife a la Parrilla"
                  value={newDishData.name}
                  onChange={(e) => setNewDishData({ ...newDishData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Descripción / Ingredientes</label>
                <textarea
                  rows={2}
                  placeholder="Descripción que se muestra en el POS..."
                  value={newDishData.description}
                  onChange={(e) => setNewDishData({ ...newDishData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">
                    Precio Venta ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newDishData.price}
                    onChange={(e) => setNewDishData({ ...newDishData, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Estación Cocina</label>
                  <select
                    value={newDishData.station}
                    onChange={(e) => setNewDishData({ ...newDishData, station: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="parrilla">Parrilla & Brasas</option>
                    <option value="cocina_caliente">Cocina Caliente</option>
                    <option value="cocina_fria">Cuarto Frío</option>
                    <option value="bar">Barra & Bebidas</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewDishModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Crear Plato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
