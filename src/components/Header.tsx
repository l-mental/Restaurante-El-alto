import React from 'react';
import {
  Bell,
  BellOff,
  Coins,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Layers,
  UtensilsCrossed,
  Boxes,
  TrendingUp,
  ReceiptText,
  Wallet,
  Users,
  Settings,
  ChefHat,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

interface HeaderProps {
  onOpenQuickOrder?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuickOrder }) => {
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
        return { title: 'Punto de Venta POS', subtitle: 'Control de mesas, comandas y facturación rápida' };
      case 'kds':
        return { title: 'Cocina KDS', subtitle: 'Monitor de comandas y preparación por estaciones' };
      case 'inventory':
        return { title: 'Control de Inventarios', subtitle: 'Materias primas, kardex, stock mínimo y mermas' };
      case 'recipes':
        return { title: 'Escandallo & Costeo', subtitle: 'Costeo unitario de platos, recetas y food cost %' };
      case 'capital':
        return { title: 'Capital Invertido vs. Esperado', subtitle: 'Estaciones de trabajo, inventario y rendimiento' };
      case 'sales':
        return { title: 'Historial de Ventas', subtitle: 'Registro diario de tickets, boletas y facturas' };
      case 'cash':
        return { title: 'Control de Caja & Turno', subtitle: 'Arqueo de efectivo, gaveta y balance del turno' };
      case 'staff':
        return { title: 'Personal & Estaciones', subtitle: 'Asignación de estaciones, turnos y métricas' };
      case 'settings':
        return { title: 'Configuración General', subtitle: 'Moneda, impuestos, costos fijos y parámetros' };
      default:
        return { title: 'GourmetOS', subtitle: 'Gestión Gastronómica' };
    }
  };

  const tabInfo = getTabInfo();

  return (
    <header className="h-16 px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 z-20">
      {/* Zone 1: Section Title */}
      <div className="flex items-center gap-3 truncate">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight leading-tight truncate">
            {tabInfo.title}
          </h2>
          <p className="text-xs text-slate-400 truncate hidden sm:block">
            {tabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Zone 2: Real-time Indicators (Clean typographic metrics, no pills) */}
      <div className="hidden lg:flex items-center gap-5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>Mesas Ocupadas:</span>
          <span className="font-mono-numbers text-slate-200 font-semibold">
            {occupiedTables} / {tables.length}
          </span>
        </div>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <div className="flex items-center gap-2">
          <span>Por Cobrar:</span>
          <span className="font-mono-numbers text-amber-300 font-semibold">
            {billingTables}
          </span>
        </div>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <div className="flex items-center gap-2">
          <span>Alertas Stock:</span>
          <span
            className={`font-mono-numbers font-semibold ${
              criticalStockCount > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {criticalStockCount} insumos
          </span>
        </div>
      </div>

      {/* Zone 3: Actions & Quick Settings */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Currency Switcher */}
        <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
          {(['USD', 'SOL', 'EUR'] as const).map((curr) => {
            const sym = curr === 'USD' ? '$' : curr === 'SOL' ? 'S/.' : '€';
            const isActive = settings.currency === curr;
            return (
              <button
                key={curr}
                onClick={() => updateSettings({ ...settings, currency: curr, currencySymbol: sym })}
                className={`px-2 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                  isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title={`Cambiar moneda a ${curr}`}
              >
                {sym}
              </button>
            );
          })}
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => setSoundAlerts(!soundAlerts)}
          className={`p-2 rounded-lg border transition-colors ${
            soundAlerts
              ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
              : 'bg-slate-800/40 text-slate-500 border-slate-800 hover:text-slate-300'
          }`}
          title={soundAlerts ? 'Sonido de comandas activado' : 'Sonido silenciado'}
        >
          {soundAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
