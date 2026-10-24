import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingDown,
  Trash2,
  Edit2,
  DollarSign,
  PackageCheck,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { InventoryItem, InventoryCategory } from '../types/restaurant';

export const InventoryView: React.FC = () => {
  const {
    inventory,
    wastes,
    settings,
    financials,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    registerStockPurchase,
    registerWaste,
  } = useRestaurant();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyAlerts, setOnlyAlerts] = useState<boolean>(false);

  // Modals state
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false);
  const [isWasteModalOpen, setIsWasteModalOpen] = useState<boolean>(false);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form states for Purchase
  const [purchaseItemId, setPurchaseItemId] = useState<string>(inventory[0]?.id || '');
  const [purchaseQty, setPurchaseQty] = useState<string>('');
  const [purchaseCost, setPurchaseCost] = useState<string>('');
  const [purchaseSupplier, setPurchaseSupplier] = useState<string>('');

  // Form states for Waste
  const [wasteItemId, setWasteItemId] = useState<string>(inventory[0]?.id || '');
  const [wasteQty, setWasteQty] = useState<string>('');
  const [wasteReason, setWasteReason] = useState<'vencimiento' | 'merma_preparacion' | 'accidente_cocina' | 'calidad_proveedor'>('merma_preparacion');
  const [wasteReporter, setWasteReporter] = useState<string>('Chef de Cocina');

  // Form states for New Item
  const [newItemData, setNewItemData] = useState({
    code: '',
    name: '',
    category: 'Carnes' as InventoryCategory,
    unit: 'kg' as 'kg' | 'g' | 'L' | 'ml' | 'un',
    currentStock: 0,
    minStock: 5,
    optimalStock: 20,
    unitCost: 0,
    supplier: '',
  });

  // Filter items
  const filteredInventory = inventory.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAlert = onlyAlerts ? item.currentStock <= item.minStock : true;
    return matchesCategory && matchesSearch && matchesAlert;
  });

  const categories = Array.from(new Set(inventory.map((i) => i.category)));

  // Handle submit purchase
  const handleSubmitPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseItemId || !purchaseQty || Number(purchaseQty) <= 0) return;
    const targetItem = inventory.find((i) => i.id === purchaseItemId);
    const unitCost = purchaseCost ? Number(purchaseCost) : targetItem ? targetItem.unitCost : 0;

    registerStockPurchase(
      purchaseItemId,
      Number(purchaseQty),
      unitCost,
      purchaseSupplier || targetItem?.supplier || ''
    );

    setIsPurchaseModalOpen(false);
    setPurchaseQty('');
    setPurchaseCost('');
  };

  // Handle submit waste
  const handleSubmitWaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteItemId || !wasteQty || Number(wasteQty) <= 0) return;
    const item = inventory.find((i) => i.id === wasteItemId);
    if (!item) return;

    registerWaste({
      inventoryItemId: item.id,
      itemName: item.name,
      quantity: Number(wasteQty),
      unit: item.unit,
      unitCost: item.unitCost,
      totalCost: Number(wasteQty) * item.unitCost,
      reason: wasteReason,
      reportedBy: wasteReporter,
    });

    setIsWasteModalOpen(false);
    setWasteQty('');
  };

  // Handle create item
  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemData.name || !newItemData.code) return;

    addInventoryItem(newItemData);
    setIsNewItemModalOpen(false);
    setNewItemData({
      code: '',
      name: '',
      category: 'Carnes',
      unit: 'kg',
      currentStock: 0,
      minStock: 5,
      optimalStock: 20,
      unitCost: 0,
      supplier: '',
    });
  };

  // Handle save edit
  const handleSaveEditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateInventoryItem(editingItem);
    setEditingItem(null);
  };

  const totalStockItems = inventory.length;
  const criticalItemsCount = inventory.filter((i) => i.currentStock <= i.minStock).length;
  const totalWastedToday = wastes.reduce((acc, w) => acc + w.totalCost, 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
      {/* Top Metric Bar (60-30-10 discipline, clean text metrics) */}
      <div className="p-6 pb-4 border-b border-slate-800 bg-slate-900/40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold block mb-1">
              Capital en Inventario
            </span>
            <div className="text-2xl font-bold font-mono-numbers text-white">
              {settings.currencySymbol}
              {financials.capitalInvestedStock.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {totalStockItems} referencias activas
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold block mb-1">
              Potencial de Venta (Stock)
            </span>
            <div className="text-2xl font-bold font-mono-numbers text-amber-400">
              {settings.currencySymbol}
              {financials.capitalExpectedSalesValue.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Margen bruto esp: {financials.expectedGrossMarginPct.toFixed(1)}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold block mb-1">
              Alertas de Reorden
            </span>
            <div
              className={`text-2xl font-bold font-mono-numbers ${
                criticalItemsCount > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {criticalItemsCount} Insumos
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Bajo umbral mínimo seguro
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold block mb-1">
              Mermas & Desperdicio
            </span>
            <div className="text-2xl font-bold font-mono-numbers text-slate-200">
              {settings.currencySymbol}
              {totalWastedToday.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {wastes.length} registros computados
            </span>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código, ingrediente o proveedor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            onClick={() => setOnlyAlerts(!onlyAlerts)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-colors ${
              onlyAlerts
                ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            Solo Alertas ({criticalItemsCount})
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsWasteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 rounded-lg transition-colors"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            Registrar Merma
          </button>

          <button
            onClick={() => setIsPurchaseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-lg transition-colors"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Reabastecer / Compra
          </button>

          <button
            onClick={() => setIsNewItemModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Nuevo Insumo
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-6 py-2 border-b border-slate-800 bg-slate-950 flex gap-1 overflow-x-auto">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1 text-xs rounded whitespace-nowrap transition-colors ${
            categoryFilter === 'all'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Todos los Insumos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 text-xs rounded whitespace-nowrap transition-colors ${
              categoryFilter === cat
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Inventory Table (High-density tabular discipline) */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">CÓDIGO</th>
                <th className="py-3 px-4">MATERIA PRIMA / INSUMO</th>
                <th className="py-3 px-4">CATEGORÍA</th>
                <th className="py-3 px-4 text-right">STOCK ACTUAL</th>
                <th className="py-3 px-4 text-right">MÍNIMO</th>
                <th className="py-3 px-4 text-right">COSTO UNITARIO</th>
                <th className="py-3 px-4 text-right">VALOR INVERTIDO</th>
                <th className="py-3 px-4">PROVEEDOR</th>
                <th className="py-3 px-4 text-center">ESTADO</th>
                <th className="py-3 px-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInventory.map((item) => {
                const totalCost = item.currentStock * item.unitCost;
                const isCritical = item.currentStock <= item.minStock;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/50 transition-colors font-medium text-slate-300"
                  >
                    <td className="py-3 px-4 font-mono-numbers text-slate-400">{item.code}</td>
                    <td className="py-3 px-4 text-white font-semibold">{item.name}</td>
                    <td className="py-3 px-4 text-slate-400">{item.category}</td>
                    <td className="py-3 px-4 text-right font-mono-numbers">
                      <span className={isCritical ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                        {item.currentStock.toFixed(2)} {item.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers text-slate-400">
                      {item.minStock} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers text-slate-300">
                      {settings.currencySymbol}
                      {item.unitCost.toFixed(2)} / {item.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers font-bold text-amber-300">
                      {settings.currencySymbol}
                      {totalCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-slate-400 truncate max-w-[140px]">
                      {item.supplier}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded ${
                          isCritical
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {isCritical ? 'CRÍTICO' : 'ÓPTIMO'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          title="Editar insumo"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteInventoryItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="Eliminar insumo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* REABASTECER / COMPRA MODAL */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Registrar Compra / Entrada de Stock</h3>
              <button
                onClick={() => setIsPurchaseModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitPurchase} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Insumo a Recibir</label>
                <select
                  value={purchaseItemId}
                  onChange={(e) => setPurchaseItemId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {inventory.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} (Stock actual: {i.currentStock} {i.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Cantidad Recibida</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="ej. 10"
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">
                    Costo Unitario ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Costo por unidad"
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Proveedor (Opcional)</label>
                <input
                  type="text"
                  placeholder="Nombre del proveedor o distribuidor"
                  value={purchaseSupplier}
                  onChange={(e) => setPurchaseSupplier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPurchaseModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Registrar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTRAR MERMA MODAL */}
      {isWasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Registrar Merma / Desperdicio</h3>
              <button
                onClick={() => setIsWasteModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitWaste} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Insumo Mermado</label>
                <select
                  value={wasteItemId}
                  onChange={(e) => setWasteItemId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {inventory.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} (Disponible: {i.currentStock} {i.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Cantidad a Descontar</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="ej. 0.5"
                  value={wasteQty}
                  onChange={(e) => setWasteQty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Motivo de la Merma</label>
                <select
                  value={wasteReason}
                  onChange={(e) => setWasteReason(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="merma_preparacion">Merma técnica en preparación / limpieza</option>
                  <option value="vencimiento">Vencimiento / Caducidad</option>
                  <option value="accidente_cocina">Accidente / Caída en cocina</option>
                  <option value="calidad_proveedor">Mala calidad de origen / Rechazado</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsWasteModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold"
                >
                  Confirmar Descuento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NUEVO INSUMO MODAL */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Crear Nuevo Insumo / Materia Prima</h3>
              <button
                onClick={() => setIsNewItemModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateNewItem} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Código</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. CAR-05"
                    value={newItemData.code}
                    onChange={(e) => setNewItemData({ ...newItemData, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Categoría</label>
                  <select
                    value={newItemData.category}
                    onChange={(e) => setNewItemData({ ...newItemData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Carnes">Carnes</option>
                    <option value="Aves & Pescados">Aves & Pescados</option>
                    <option value="Verduras & Frutas">Verduras & Frutas</option>
                    <option value="Lácteos & Quesos">Lácteos & Quesos</option>
                    <option value="Abarrotes & Especias">Abarrotes & Especias</option>
                    <option value="Licores & Bebidas">Licores & Bebidas</option>
                    <option value="Descartables & Empaques">Descartables</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Nombre del Insumo</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Lomo Fino de Res"
                  value={newItemData.name}
                  onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Unidad</label>
                  <select
                    value={newItemData.unit}
                    onChange={(e) => setNewItemData({ ...newItemData, unit: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="L">L</option>
                    <option value="ml">ml</option>
                    <option value="un">un (unidad)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Stock Inicial</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItemData.currentStock}
                    onChange={(e) => setNewItemData({ ...newItemData, currentStock: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Stock Mínimo</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItemData.minStock}
                    onChange={(e) => setNewItemData({ ...newItemData, minStock: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">
                    Costo Unitario ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newItemData.unitCost}
                    onChange={(e) => setNewItemData({ ...newItemData, unitCost: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Proveedor Principal</label>
                  <input
                    type="text"
                    placeholder="Distribuidor"
                    value={newItemData.supplier}
                    onChange={(e) => setNewItemData({ ...newItemData, supplier: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Crear Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDITAR INSUMO MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Editar Insumo: {editingItem.name}</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditItem} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Stock Actual</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.currentStock}
                    onChange={(e) => setEditingItem({ ...editingItem, currentStock: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Stock Mínimo</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.minStock}
                    onChange={(e) => setEditingItem({ ...editingItem, minStock: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">
                    Costo Unitario ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.unitCost}
                    onChange={(e) => setEditingItem({ ...editingItem, unitCost: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Proveedor</label>
                  <input
                    type="text"
                    value={editingItem.supplier}
                    onChange={(e) => setEditingItem({ ...editingItem, supplier: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
