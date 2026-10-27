import React from 'react';
import {
  Volume2,
  VolumeX,
  Clock,
  Layers,
  UtensilsCrossed,
  Boxes,
  TrendingUp,
  ReceiptText,
  Wallet,
  Users,
  Settings,
  ChefHat,
  Monitor,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    tables,
    inventory,
    orders,
    settings,
    updateSettings,
    soundAlerts,
    setSoundAlerts,
    financials,
  } = useRestaurant();

  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
  const billingTables = tables.filter((t) => t.status === 'billing').length;
  const criticalStockCount = inventory.filter((i) => i.currentStock <= i.minStock).length;

  const getTabInfo = () => {
    switch (activeTab) {
      case 'pos':
        return { title: 'Punto de Venta POS', subtitle: 'Control táctil de mesas y pedidos', code: 'POS-01' };
      case 'kds':
        return { title: 'Cocina KDS', subtitle: 'Monitor de preparación en marcha', code: 'KDS-02' };
      case 'inventory':
        return { title: 'Control de Inventarios', subtitle: 'Kardex, stock mínimo y mermas', code: 'INV-03' };
      case 'recipes':
        return { title: 'Escandallo & Costeo', subtitle: 'Costeo unitario y food cost %', code: 'ESC-04' };
      case 'capital':
        return { title: 'Capital Invertido vs. Esperado', subtitle: 'Estaciones de trabajo y rentabilidad', code: 'CAP-05' };
      case 'sales':
        return { title: 'Historial de Ventas', subtitle: 'Comprobantes y tickets emitidos', code: 'REC-06' };
      case 'cash':
        return { title: 'Control de Caja & Arqueo', subtitle: 'Gaveta de efectivo y balance Z', code: 'CAJ-07' };
      case 'staff':
        return { title: 'Personal & Estaciones', subtitle: 'Turnos y comisiones de servicio', code: 'PER-08' };
      case 'settings':
        return { title: 'Configuración del Sistema', subtitle: 'Impuestos, costos fijos y parámetros', code: 'CFG-09' };
      default:
        return { title: 'GourmetOS Desktop', subtitle: 'Gestión Gastronómica', code: 'APP-00' };
    }
  };

  const tabInfo = getTabInfo();

  return (
    <header className="h-12 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 z-20 select-none">
      {/* Zone 1: Section Title & Desktop Breadcrumb */}
      <div className="flex items-center gap-2.5 truncate">
        <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold shrink-0">
          {tabInfo.code}
        </span>
        <div className="truncate">
          <h2 className="font-desktop-heading text-sm font-bold text-white tracking-tight leading-tight truncate">
            {tabInfo.title}
          </h2>
          <p className="text-[10px] text-slate-400 truncate hidden sm:block leading-tight">
            {tabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Zone 2: Real-time Indicators (Clean typographic metrics, no pills) */}
      <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span>Mesas:</span>
          <span className="font-mono-numbers text-slate-200 font-bold">
            {occupiedTables} / {tables.length}
          </span>
        </div>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <div className="flex items-center gap-1.5">
          <span>Por Cobrar:</span>
          <span className="font-mono-numbers text-amber-300 font-bold">
            {billingTables}
          </span>
        </div>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <div className="flex items-center gap-1.5">
          <span>Alertas Stock:</span>
          <span
            className={`font-mono-numbers font-bold ${
              criticalStockCount > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {criticalStockCount} ítems
          </span>
        </div>
      </div>

      {/* Zone 3: Desktop Controls & Currency Selector */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Currency Switcher */}
        <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[11px]">
          {(['BOB', 'USD', 'SOL', 'EUR'] as const).map((curr) => {
            const sym = curr === 'BOB' ? 'Bs.' : curr === 'USD' ? '$' : curr === 'SOL' ? 'S/.' : '€';
            const isActive = settings.currency === curr;
            return (
              <button
                key={curr}
                onClick={() => updateSettings({ ...settings, currency: curr, currencySymbol: sym })}
                className={`px-2 py-0.5 font-mono font-medium rounded transition-colors ${
                  isActive ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title={`Cambiar moneda a ${curr === 'BOB' ? 'Bolivianos (Bs.)' : curr}`}
              >
                {sym}
              </button>
            );
          })}
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => setSoundAlerts(!soundAlerts)}
          className={`p-1.5 rounded-lg border transition-colors ${
            soundAlerts
              ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
              : 'bg-slate-800/40 text-slate-500 border-slate-800 hover:text-slate-300'
          }`}
          title={soundAlerts ? 'Sonido de comandas activado' : 'Sonido silenciado'}
        >
          {soundAlerts ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
