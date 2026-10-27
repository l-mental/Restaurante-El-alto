import React from 'react';
import {
  Keyboard,
  Printer,
  Scale,
  ShieldCheck,
  UserCheck,
  CircleDot,
  Cpu,
  Database,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const DesktopStatusBar: React.FC = () => {
  const { activeTab, setActiveTab, cashShift, financials, settings } = useRestaurant();

  const shortcuts = [
    { key: 'F1', label: 'POS Mesas', id: 'pos' },
    { key: 'F2', label: 'KDS Cocina', id: 'kds' },
    { key: 'F3', label: 'Stock', id: 'inventory' },
    { key: 'F4', label: 'Escandallo', id: 'recipes' },
    { key: 'F5', label: 'Capital', id: 'capital' },
    { key: 'F6', label: 'Arqueo', id: 'cash' },
    { key: 'F7', label: 'Ventas', id: 'sales' },
  ];

  return (
    <footer className="h-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-3 text-[11px] select-none text-slate-400 shrink-0 z-30">
      {/* LEFT: Quick Keyboard Shortcuts */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 pr-1.5">
          <Keyboard className="w-3 h-3 text-slate-400" />
          Atajos:
        </span>
        {shortcuts.map((sc) => {
          const isActive = activeTab === sc.id;
          return (
            <button
              key={sc.key}
              onClick={() => setActiveTab(sc.id)}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <kbd className="font-mono text-[9px] px-1 py-0.2 bg-slate-800 text-slate-300 rounded border border-slate-700">
                {sc.key}
              </kbd>
              <span className="text-[10px]">{sc.label}</span>
            </button>
          );
        })}
      </div>

      {/* CENTER / RIGHT: Hardware Telemetry and Shift Status */}
      <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono-numbers">
        <div className="flex items-center gap-1 text-slate-400">
          <Printer className="w-3 h-3 text-emerald-400" />
          <span>Epson TM-T20 (80mm)</span>
        </div>

        <span className="text-slate-700">|</span>

        <div className="flex items-center gap-1 text-slate-400">
          <Scale className="w-3 h-3 text-amber-400" />
          <span>Balanza: 0.000 kg</span>
        </div>

        <span className="text-slate-700">|</span>

        <div className="flex items-center gap-1 text-slate-400">
          <UserCheck className="w-3 h-3 text-indigo-400" />
          <span>Cajero: {cashShift.cashierName}</span>
        </div>

        <span className="text-slate-700">|</span>

        <div className="flex items-center gap-1 text-emerald-400">
          <Database className="w-3 h-3" />
          <span>Local Sync: OK</span>
        </div>
      </div>
    </footer>
  );
};
