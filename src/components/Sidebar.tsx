import React from 'react';
import {
  UtensilsCrossed,
  ChefHat,
  Boxes,
  Layers,
  TrendingUp,
  ReceiptText,
  Wallet,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

interface NavItem {
  id: string;
  label: string;
  sublabel: string;
  hotkey: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    orders,
    inventory,
    cashShift,
    financials,
    settings,
  } = useRestaurant();

  // Active cooking orders count
  const pendingCookingCount = orders
    .filter((o) => o.status === 'open')
    .flatMap((o) => o.items)
    .filter((i) => i.status === 'pending' || i.status === 'preparing').length;

  // Low stock alert count
  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minStock).length;

  const navItems: NavItem[] = [
    {
      id: 'pos',
      label: 'Punto de Venta POS',
      sublabel: 'Mesas y Comandas',
      hotkey: 'F1',
      icon: UtensilsCrossed,
      badge: orders.filter((o) => o.status === 'open').length || undefined,
    },
    {
      id: 'kds',
      label: 'Cocina KDS',
      sublabel: 'Comandas en Marcha',
      hotkey: 'F2',
      icon: ChefHat,
      badge: pendingCookingCount > 0 ? pendingCookingCount : undefined,
    },
    {
      id: 'inventory',
      label: 'Inventarios & Stock',
      sublabel: 'Materias Primas',
      hotkey: 'F3',
      icon: Boxes,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
    },
    {
      id: 'recipes',
      label: 'Escandallo & Costeo',
      sublabel: 'Fichas Técnicas',
      hotkey: 'F4',
      icon: Layers,
    },
    {
      id: 'capital',
      label: 'Capital & Finanzas',
      sublabel: 'Invertido vs Esperado',
      hotkey: 'F5',
      icon: TrendingUp,
    },
    {
      id: 'sales',
      label: 'Ventas & Facturación',
      sublabel: 'Comprobantes y Tickets',
      hotkey: 'F7',
      icon: ReceiptText,
    },
    {
      id: 'cash',
      label: 'Caja & Arqueo',
      sublabel: 'Turno y Movimientos',
      hotkey: 'F6',
      icon: Wallet,
    },
    {
      id: 'staff',
      label: 'Personal & Estaciones',
      sublabel: 'Turnos y Rendimiento',
      hotkey: 'F8',
      icon: Users,
    },
    {
      id: 'settings',
      label: 'Configuración',
      sublabel: 'Parámetros del Sistema',
      hotkey: 'F9',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-slate-925 bg-slate-900 border-r border-slate-800 transition-all duration-150 z-30 select-none ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Desktop App Branch Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
            <Store className="w-4 h-4 stroke-[2.2]" />
          </div>
          {!isSidebarCollapsed && (
            <div className="truncate">
              <h1 className="font-desktop-heading font-bold text-xs tracking-tight text-white truncate">
                {settings.name}
              </h1>
              <p className="text-[10px] text-slate-400 truncate font-mono">
                Terminal POS · Salón Central
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          title={isSidebarCollapsed ? 'Expandir panel lateral (Ctrl+B)' : 'Colapsar panel lateral (Ctrl+B)'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation List - Desktop Software Styling */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
              title={isSidebarCollapsed ? `${item.label} [${item.hotkey}]` : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-amber-400 stroke-[2.2]' : 'text-slate-400'
                }`}
              />
              {!isSidebarCollapsed && (
                <div className="flex-1 truncate">
                  <div className="text-[12px] font-medium tracking-tight truncate leading-tight">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate font-normal leading-tight">
                    {item.sublabel}
                  </div>
                </div>
              )}

              {/* Desktop Shortcut Badge & Counter */}
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge !== undefined && (
                    <span
                      className={`text-[9px] font-mono-numbers px-1.5 py-0.2 rounded font-semibold ${
                        item.id === 'inventory' && lowStockCount > 0
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <kbd className="font-mono text-[9px] text-slate-400 bg-slate-950/70 border border-slate-800 px-1 py-0.2 rounded">
                    {item.hotkey}
                  </kbd>
                </div>
              )}

              {/* Collapsed dot indicators */}
              {isSidebarCollapsed && item.badge !== undefined && (
                <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-2" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Desktop App Status Card at Bottom of Sidebar */}
      {!isSidebarCollapsed ? (
        <div className="p-2.5 border-t border-slate-800 bg-slate-950/50 space-y-2">
          {/* Financial summary widget */}
          <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" />
                Ventas Turno
              </span>
              <span className="font-mono-numbers text-white font-bold text-xs">
                {settings.currencySymbol} {financials.totalTodaySales.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-numbers">
              <span>Valor Stock</span>
              <span className="text-amber-300 font-semibold">
                {settings.currencySymbol} {financials.capitalInvestedStock.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Quick Cashier Badge */}
          <div className="flex items-center justify-between px-1 text-[10px] text-slate-400 font-mono">
            <span className="truncate">Caja: {cashShift.cashierName.split(' ')[0]}</span>
            <span className="text-emerald-400 font-medium">Turno #1042</span>
          </div>
        </div>
      ) : (
        <div className="p-2.5 border-t border-slate-800 flex justify-center">
          <div className="w-2 h-2 rounded-full bg-emerald-400" title="Turno Activo" />
        </div>
      )}
    </aside>
  );
};
