import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Scale,
  Flame,
  Utensils,
  Sparkles,
  Wine,
  Users,
  Store,
  Layers,
  ArrowUpRight,
  PieChart,
  SlidersHorizontal,
  Edit3,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { Workstation } from '../types/restaurant';

export const CapitalFinanceView: React.FC = () => {
  const { workstations, updateWorkstation, financials, settings, inventory, orders } = useRestaurant();
  const [editingStation, setEditingStation] = useState<Workstation | null>(null);

  // Group inventory capital by category
  const inventoryByCategory = inventory.reduce((acc, item) => {
    const val = item.currentStock * item.unitCost;
    acc[item.category] = (acc[item.category] || 0) + val;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(inventoryByCategory).sort((a, b) => b[1] - a[1]);

  // Handle edit station
  const handleSaveStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStation) return;
    updateWorkstation(editingStation);
    setEditingStation(null);
  };

  const getStationIcon = (code: string) => {
    switch (code) {
      case 'parrilla':
        return Flame;
      case 'cocina_caliente':
        return Utensils;
      case 'cocina_fria':
        return Sparkles;
      case 'bar':
        return Wine;
      case 'salon':
        return Users;
      case 'caja':
        return Store;
      default:
        return Layers;
    }
  };

  // Capital Multiplier
  const capitalMultiplier = financials.capitalInvestedStock > 0
    ? (financials.capitalExpectedSalesValue / financials.capitalInvestedStock).toFixed(1)
    : '0';

  // Break-even progress
  const breakEvenProgress = financials.dailyBreakEvenSales > 0
    ? Math.min(100, (financials.totalTodaySales / financials.dailyBreakEvenSales) * 100)
    : 0;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950 p-6 space-y-6">
      {/* Top Banner: Capital Invertido vs. Capital Esperado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card: CAPITAL INVERTIDO TOTAL */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Scale className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Capital Invertido Total
                </h3>
                <p className="text-xs text-slate-400">
                  Activos en estaciones de trabajo + inventario físico
                </p>
              </div>
            </div>
            <span className="text-xs font-mono-numbers text-slate-400">Patrimonio Operativo</span>
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono-numbers">
            {settings.currencySymbol}
            {financials.totalCapitalInvested.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          {/* Breakdown bars */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-blue-400" />
                Estaciones de Trabajo & Maquinaria ({workstations.length} estaciones)
              </span>
              <span className="font-mono-numbers text-slate-200 font-semibold">
                {settings.currencySymbol}
                {financials.capitalInvestedStations.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-amber-400" />
                Stock / Materias Primas en Almacén ({inventory.length} insumos)
              </span>
              <span className="font-mono-numbers text-amber-300 font-semibold">
                {settings.currencySymbol}
                {financials.capitalInvestedStock.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Card: CAPITAL ESPERADO & RENDIMIENTO PROYECTADO */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/20 border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                  Capital Esperado (Retorno)
                </h3>
                <p className="text-xs text-slate-400">
                  Valor potencial de venta del stock actual en carta
                </p>
              </div>
            </div>
            <span className="text-xs font-mono-numbers font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              {capitalMultiplier}x Retorno
            </span>
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono-numbers">
            {settings.currencySymbol}
            {financials.capitalExpectedSalesValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          {/* Breakdown bars */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Margen Bruto Proyectado de Inventario:</span>
              <span className="font-mono-numbers text-emerald-400 font-bold">
                +{financials.expectedGrossMarginPct.toFixed(1)}% ({settings.currencySymbol}{financials.expectedGrossProfit.toLocaleString('es-ES', { minimumFractionDigits: 2 })})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Food Cost Medio del Menú:</span>
              <span className="font-mono-numbers text-slate-300">
                {(100 - financials.expectedGrossMarginPct).toFixed(1)}% del precio carta
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Break-Even & Today P&L Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Punto de Equilibrio */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Punto de Equilibrio Diario (Break-Even)
            </h4>
            <span className="text-xs font-mono-numbers text-slate-400">
              Meta: {settings.currencySymbol}{financials.dailyBreakEvenSales.toFixed(2)}/día
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Ventas requeridas para absorber el costo fijo diario de {settings.currencySymbol}{financials.dailyFixedCosts.toFixed(2)} (alquiler, nóminas fijas y suministros).
          </p>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono-numbers">
              <span className="text-slate-400">
                Alcanzado hoy: {settings.currencySymbol}{financials.totalTodaySales.toFixed(2)}
              </span>
              <span
                className={`font-bold ${
                  breakEvenProgress >= 100 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {breakEvenProgress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  breakEvenProgress >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${breakEvenProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* P&L Express Hoy */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider mb-2">
            Estado de Pérdidas y Ganancias (P&L Hoy)
          </h4>
          <div className="flex justify-between text-slate-300">
            <span>(+) Ventas Brutas Totales:</span>
            <span className="font-mono-numbers font-semibold">
              {settings.currencySymbol}{financials.totalTodaySales.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-rose-400">
            <span>(-) Costo de Insumos Vendidos (CMV):</span>
            <span className="font-mono-numbers font-semibold">
              -{settings.currencySymbol}{financials.totalTodayCost.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-amber-300 font-semibold pt-1 border-t border-slate-800">
            <span>(=) Margen Bruto del Día ({financials.todayGrossMarginPct.toFixed(1)}%):</span>
            <span className="font-mono-numbers">
              {settings.currencySymbol}{financials.totalTodayGrossProfit.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>(-) Costo Fijo Prorrateado Diario:</span>
            <span className="font-mono-numbers">
              -{settings.currencySymbol}{financials.dailyFixedCosts.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-slate-700">
            <span className="text-white">(=) Utilidad Neta Hoy:</span>
            <span
              className={`font-mono-numbers ${
                financials.netProfitToday >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {financials.netProfitToday >= 0 ? '+' : ''}
              {settings.currencySymbol}{financials.netProfitToday.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION: ESTACIONES DE TRABAJO Y CAPITAL INVERTIDO */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">
              Estaciones de Capital Invertido
            </h3>
            <p className="text-xs text-slate-400">
              Desglose detallado de la inversión en equipamiento, menaje y costo por hora de cada estación operativa
            </p>
          </div>
          <span className="text-xs font-mono-numbers text-slate-400">
            {workstations.length} estaciones configuradas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workstations.map((ws) => {
            const Icon = getStationIcon(ws.code);
            const totalWsCapital = ws.capitalInvestedEquipment + ws.capitalInvestedTools;

            return (
              <div
                key={ws.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Station Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs leading-tight">{ws.name}</h4>
                        <span className="text-[11px] text-slate-400">Resp: {ws.responsibleLead}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingStation(ws)}
                      className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                      title="Editar valores de la estación"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 mb-3">
                    {ws.description}
                  </p>

                  {/* Financial metrics for this station */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Equipamiento / Maquinaria:</span>
                      <span className="font-mono-numbers text-slate-200 font-semibold">
                        {settings.currencySymbol}
                        {ws.capitalInvestedEquipment.toLocaleString('es-ES')}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Menaje & Herramientas:</span>
                      <span className="font-mono-numbers text-slate-200">
                        {settings.currencySymbol}
                        {ws.capitalInvestedTools.toLocaleString('es-ES')}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-amber-300 pt-1 border-t border-slate-800">
                      <span>Capital Total Invertido:</span>
                      <span className="font-mono-numbers">
                        {settings.currencySymbol}
                        {totalWsCapital.toLocaleString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer operational stats */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Costo Operativo:</span>
                  <span className="font-mono-numbers font-medium text-slate-300">
                    {settings.currencySymbol}{ws.hourlyOperatingCost.toFixed(2)}/hora
                  </span>
                  <span className="font-mono-numbers text-slate-400">
                    {ws.activeStaffCount} personas
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: CAPITAL INVERTIDO EN STOCK POR CATEGORÍA */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">
              Distribución de Capital Invertido en Materias Primas
            </h3>
            <p className="text-xs text-slate-400">
              Concentración monetaria del stock según categoría de alimentos y bebidas
            </p>
          </div>
          <span className="text-xs font-mono-numbers text-amber-400 font-bold">
            Total: {settings.currencySymbol}{financials.capitalInvestedStock.toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedCategories.map(([category, amount]) => {
            const pct = financials.capitalInvestedStock > 0
              ? (amount / financials.capitalInvestedStock) * 100
              : 0;

            return (
              <div key={category} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">{category}</span>
                  <span className="font-mono-numbers text-amber-300 font-bold">
                    {settings.currencySymbol}{amount.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 text-right font-mono-numbers">
                    {pct.toFixed(1)}% del inventario
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL EDITAR ESTACIÓN DE TRABAJO */}
      {editingStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">
                Editar Estación: {editingStation.name}
              </h3>
              <button
                onClick={() => setEditingStation(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveStation} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">
                  Inversión en Maquinaria & Equipamiento ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  step="10"
                  required
                  value={editingStation.capitalInvestedEquipment}
                  onChange={(e) =>
                    setEditingStation({
                      ...editingStation,
                      capitalInvestedEquipment: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">
                  Inversión en Menaje & Utensilios ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  step="10"
                  required
                  value={editingStation.capitalInvestedTools}
                  onChange={(e) =>
                    setEditingStation({
                      ...editingStation,
                      capitalInvestedTools: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">
                  Costo Operativo por Hora ({settings.currencySymbol}/h)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={editingStation.hourlyOperatingCost}
                  onChange={(e) =>
                    setEditingStation({
                      ...editingStation,
                      hourlyOperatingCost: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Líder Responsable</label>
                <input
                  type="text"
                  value={editingStation.responsibleLead}
                  onChange={(e) =>
                    setEditingStation({ ...editingStation, responsibleLead: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStation(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Guardar Estación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
