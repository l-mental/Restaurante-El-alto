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
      icon: UtensilsCrossed,
      badge: orders.filter((o) => o.status === 'open').length || undefined,
    },
    {
      id: 'kds',
      label: 'Cocina KDS',
      sublabel: 'Comandas en Marcha',
      icon: ChefHat,
      badge: pendingCookingCount > 0 ? pendingCookingCount : undefined,
    },
    {
      id: 'inventory',
      label: 'Inventarios & Stock',
      sublabel: 'Materias Primas',
      icon: Boxes,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
    },
    {
      id: 'recipes',
      label: 'Escandallo & Costeo',
      sublabel: 'Fichas Técnicas',
      icon: Layers,
    },
    {
      id: 'capital',
      label: 'Capital & Finanzas',
      sublabel: 'Invertido vs Esperado',
      icon: TrendingUp,
    },
    {
      id: 'sales',
      label: 'Ventas & Facturación',
      sublabel: 'Comprobantes y Tickets',
      icon: ReceiptText,
    },
    {
      id: 'cash',
      label: 'Caja & Arqueo',
      sublabel: 'Turno y Movimientos',
      icon: Wallet,
    },
    {
      id: 'staff',
      label: 'Personal & Estaciones',
      sublabel: 'Turnos y Rendimiento',
      icon: Users,
    },
    {
      id: 'settings',
      label: 'Configuración',
      sublabel: 'Parámetros del Sistema',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-200 z-30 select-none ${
        isSidebarCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
            <Store className="w-5 h-5 stroke-[2.2]" />
          </div>
          {!isSidebarCollapsed && (
            <div className="truncate">
              <h1 className="font-bold text-sm tracking-tight text-white truncate">
                {settings.name}
              </h1>
              <p className="text-xs text-slate-400 truncate">
                Sistema Integral de Restaurante
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          title={isSidebarCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-amber-400 stroke-[2.2]' : 'text-slate-400'
                }`}
              />
              {!isSidebarCollapsed && (
                <div className="flex-1 truncate">
                  <div className="text-xs font-semibold tracking-wide truncate">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate font-normal">
                    {item.sublabel}
                  </div>
                </div>
              )}
              {item.badge !== undefined && !isSidebarCollapsed && (
                <span
                  className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded ${
                    item.id === 'inventory' && lowStockCount > 0
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {item.badge !== undefined && isSidebarCollapsed && (
                <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-2" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Summary Footer Card */}
      {!isSidebarCollapsed ? (
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
          {/* Quick Financial Snapshot */}
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Ventas Hoy
              </span>
              <span className="font-mono-numbers text-slate-200 font-semibold">
                {settings.currencySymbol} {financials.totalTodaySales.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Capital en Stock</span>
              <span className="font-mono-numbers text-slate-300">
                {settings.currencySymbol} {financials.capitalInvestedStock.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Cashier Shift Info */}
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
            <span className="truncate">Caja: {cashShift.cashierName}</span>
            <span className="font-mono-numbers text-emerald-400">Turno Abierto</span>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-800 flex justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="Turno de Caja Abierto" />
        </div>
      )}
    </aside>
  );
};
