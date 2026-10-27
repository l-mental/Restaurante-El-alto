import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  Minimize2,
  Minus,
  Square,
  X,
  Printer,
  Wifi,
  HardDrive,
  Clock,
  Sparkles,
  Store,
  ChevronDown,
  Monitor,
  RefreshCw,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

interface DesktopTitleBarProps {
  onToggleSidebar?: () => void;
}

export const DesktopTitleBar: React.FC<DesktopTitleBarProps> = ({ onToggleSidebar }) => {
  const { settings, activeTab, setActiveTab, cashShift, setIsSidebarCollapsed } = useRestaurant();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.desktop-menu-container')) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="h-9 bg-slate-950 border-b border-slate-800/90 flex items-center justify-between px-3 select-none text-[11px] text-slate-300 shrink-0 z-40 relative">
      {/* LEFT: Window Traffic Lights & Desktop App Menus */}
      <div className="flex items-center gap-3 desktop-menu-container">
        {/* macOS Window Controls */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
          <div
            className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 border border-rose-600/50 cursor-pointer transition-colors"
            title="Cerrar sesión de escritorio"
            onClick={() => setActiveTab('pos')}
          />
          <div
            className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 border border-amber-600/50 cursor-pointer transition-colors"
            title="Minimizar barra lateral"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          />
          <div
            className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 border border-emerald-600/50 cursor-pointer transition-colors"
            title="Pantalla Completa (F11)"
            onClick={handleToggleFullscreen}
          />
        </div>

        {/* Brand Lockup */}
        <div className="flex items-center gap-1.5 text-white font-semibold pr-2 border-r border-slate-800/80">
          <Store className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-desktop-heading tracking-tight text-xs text-slate-100 font-bold">
            GourmetOS Pro
          </span>
          <span className="text-[10px] text-amber-400/90 font-mono-numbers bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/20">
            v2.6
          </span>
        </div>

        {/* Desktop Menu Bar */}
        <nav className="hidden sm:flex items-center gap-1 text-slate-300">
          {/* Archivo */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'archivo' ? null : 'archivo')}
              className={`px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition-colors ${
                activeMenu === 'archivo' ? 'bg-slate-800 text-white font-medium' : ''
              }`}
            >
              Archivo
            </button>
            {activeMenu === 'archivo' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    setActiveTab('pos');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-amber-500/20 hover:text-amber-300 flex justify-between"
                >
                  <span>Nueva Comanda</span>
                  <span className="text-slate-500 font-mono text-[10px]">F1</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-amber-500/20 hover:text-amber-300 flex justify-between"
                >
                  <span>Configuración General</span>
                  <span className="text-slate-500 font-mono text-[10px]">F9</span>
                </button>
                <div className="my-1 border-t border-slate-800" />
                <button
                  onClick={() => {
                    window.location.reload();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                >
                  Recargar Aplicación
                </button>
              </div>
            )}
          </div>

          {/* Operaciones */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'operaciones' ? null : 'operaciones')}
              className={`px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition-colors ${
                activeMenu === 'operaciones' ? 'bg-slate-800 text-white font-medium' : ''
              }`}
            >
              Operaciones
            </button>
            {activeMenu === 'operaciones' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    setActiveTab('pos');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-amber-500/20 hover:text-amber-300 flex justify-between"
                >
                  <span>Punto de Venta POS</span>
                  <span className="text-slate-500 font-mono text-[10px]">F1</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('kds');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-amber-500/20 hover:text-amber-300 flex justify-between"
                >
                  <span>Cocina KDS</span>
                  <span className="text-slate-500 font-mono text-[10px]">F2</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('sales');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-amber-500/20 hover:text-amber-300 flex justify-between"
                >
                  <span>Historial de Tickets</span>
                  <span className="text-slate-500 font-mono text-[10px]">F7</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('cash');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-amber-500/20 hover:text-amber-300 flex justify-between"
                >
                  <span>Caja & Arqueo</span>
                  <span className="text-slate-500 font-mono text-[10px]">F6</span>
                </button>
              </div>
            )}
          </div>

          {/* Gestión */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'gestion' ? null : 'gestion')}
              className={`px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition-colors ${
                activeMenu === 'gestion' ? 'bg-slate-800 text-white font-medium' : ''
              }`}
            >
              Gestión
            </button>
            {activeMenu === 'gestion' && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    setActiveTab('inventory');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-amber-500/20 hover:text-amber-300 flex justify-between"
                >
                  <span>Inventario & Stock</span>
                  <span className="text-slate-500 font-mono text-[10px]">F3</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('recipes');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-amber-500/20 hover:text-amber-300 flex justify-between"
                >
                  <span>Escandallo de Recetas</span>
                  <span className="text-slate-500 font-mono text-[10px]">F4</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('capital');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-amber-500/20 hover:text-amber-300 flex justify-between"
                >
                  <span>Capital & Finanzas</span>
                  <span className="text-slate-500 font-mono text-[10px]">F5</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('staff');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-amber-500/20 hover:text-amber-300 flex justify-between"
                >
                  <span>Personal & Estaciones</span>
                  <span className="text-slate-500 font-mono text-[10px]">F8</span>
                </button>
              </div>
            )}
          </div>

          {/* Ventana */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'ventana' ? null : 'ventana')}
              className={`px-2 py-1 rounded hover:bg-slate-800 hover:text-white transition-colors ${
                activeMenu === 'ventana' ? 'bg-slate-800 text-white font-medium' : ''
              }`}
            >
              Ventana
            </button>
            {activeMenu === 'ventana' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    setIsSidebarCollapsed((prev) => !prev);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-amber-500/20 hover:text-amber-300 flex justify-between"
                >
                  <span>Alternar Barra Lateral</span>
                  <span className="text-slate-500 font-mono text-[10px]">Ctrl+B</span>
                </button>
                <button
                  onClick={() => {
                    handleToggleFullscreen();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-amber-500/20 hover:text-amber-300 flex justify-between"
                >
                  <span>Pantalla Completa</span>
                  <span className="text-slate-500 font-mono text-[10px]">F11</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* CENTER: Current Window / Station Document Title */}
      <div className="hidden md:flex items-center gap-2 text-slate-400 font-medium text-[11px] truncate px-4">
        <span className="text-slate-200 font-semibold truncate">
          {settings.name}
        </span>
        <span className="text-slate-600">—</span>
        <span className="text-slate-400 truncate">
          [Terminal POS-01 · {settings.legalName}]
        </span>
      </div>

      {/* RIGHT: Desktop Status Telemetry & Digital Clock */}
      <div className="flex items-center gap-3">
        {/* Local Storage / SQLite sync indicator */}
        <div
          className="hidden lg:flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
          title="Almacenamiento Local Seguro Activo"
        >
          <HardDrive className="w-3 h-3 text-emerald-400" />
          <span className="font-mono-numbers text-[10px]">SQLite Local</span>
        </div>

        {/* Thermal printer status */}
        <div
          className="hidden sm:flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
          title="Impresora Térmica 80mm USB Conectada"
        >
          <Printer className="w-3 h-3 text-amber-400" />
          <span className="font-mono-numbers text-[10px]">Térmica 80mm</span>
        </div>

        {/* Fullscreen desktop toggle */}
        <button
          onClick={handleToggleFullscreen}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isFullscreen ? 'Salir de Pantalla Completa' : 'Modo Pantalla Completa (F11)'}
        >
          {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
        </button>

        {/* Desktop Clock with seconds */}
        <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-200 font-mono-numbers text-[11px] font-semibold">
          <Clock className="w-3 h-3 text-amber-400/90" />
          <span>{currentTime || '18:00:00'}</span>
        </div>
      </div>
    </div>
  );
};
