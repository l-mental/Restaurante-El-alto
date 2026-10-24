import React, { useState } from 'react';
import {
  ChefHat,
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Utensils,
  Wine,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { StationType, OrderItemStatus } from '../types/restaurant';

export const KDSView: React.FC = () => {
  const { orders, updateOrderItemStatus, soundAlerts } = useRestaurant();
  const [stationFilter, setStationFilter] = useState<StationType | 'all'>('all');

  // Filter open orders
  const openOrders = orders.filter((o) => o.status === 'open');

  // Station tabs with SVG icons (NO emojis)
  const stations = [
    { id: 'all', label: 'Toda la Cocina', icon: ChefHat },
    { id: 'parrilla', label: 'Parrilla & Brasas', icon: Flame },
    { id: 'cocina_caliente', label: 'Cocina Caliente', icon: Utensils },
    { id: 'cocina_fria', label: 'Cuarto Frío', icon: Sparkles },
    { id: 'bar', label: 'Barra & Bebidas', icon: Wine },
  ];

  const handleAdvanceStatus = (orderId: string, itemId: string, currentStatus: OrderItemStatus) => {
    let nextStatus: OrderItemStatus = 'preparing';
    if (currentStatus === 'pending') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'ready';
    else if (currentStatus === 'ready') nextStatus = 'served';

    updateOrderItemStatus(orderId, itemId, nextStatus);

    if (soundAlerts && nextStatus === 'ready') {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch bell
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {
        // AudioContext not allowed without prior user interaction
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
      {/* Top Station Selector */}
      <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-800/80 rounded-lg">
          {stations.map((st) => {
            const Icon = st.icon;
            const isActive = stationFilter === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setStationFilter(st.id as StationType | 'all')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {st.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-400 hidden sm:flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Pendiente
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            En Cocción
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Listo para Servir
          </span>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {openOrders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
              <ChefHat className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-bold text-white">Comandero al Día</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              No hay platos pendientes en cocina en este momento. Las nuevas comandas desde el POS aparecerán aquí instantáneamente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {openOrders.map((order) => {
              // Filter items by station if filter selected
              const displayItems = order.items.filter((item) => {
                if (stationFilter === 'all') return true;
                return item.station === stationFilter;
              });

              if (displayItems.length === 0) return null;

              const allReady = displayItems.every((i) => i.status === 'ready' || i.status === 'served');

              return (
                <div
                  key={order.id}
                  className={`flex flex-col rounded-xl border bg-slate-900 overflow-hidden shadow-lg transition-all ${
                    allReady
                      ? 'border-emerald-500/50 shadow-emerald-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header */}
                  <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-amber-400 text-sm tracking-wide">
                          #{order.orderNumber}
                        </span>
                        <span className="text-sm font-bold text-white">{order.tableName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {order.serverName} · {order.area?.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono-numbers text-slate-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{order.createdAt}</span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-4 flex-1 space-y-3">
                    {displayItems.map((item) => {
                      let statusBadgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                      let statusText = 'Pendiente';

                      if (item.status === 'preparing') {
                        statusBadgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                        statusText = 'Cocinando';
                      } else if (item.status === 'ready') {
                        statusBadgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                        statusText = '¡Listo!';
                      } else if (item.status === 'served') {
                        statusBadgeColor = 'text-slate-400 bg-slate-800/40 border-slate-700/40';
                        statusText = 'Servido';
                      }

                      return (
                        <div
                          key={item.id}
                          className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono-numbers font-extrabold text-amber-400 text-sm">
                                  {item.quantity}x
                                </span>
                                <span className="font-semibold text-white text-xs leading-snug">
                                  {item.name}
                                </span>
                              </div>
                              {item.notes && (
                                <p className="text-[11px] text-amber-300 font-medium italic mt-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                  Nota: {item.notes}
                                </p>
                              )}
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-1">
                                Estación: {item.station.replace('_', ' ')}
                              </span>
                            </div>

                            <span
                              className={`text-[10px] font-mono-numbers uppercase px-2 py-0.5 rounded border shrink-0 ${statusBadgeColor}`}
                            >
                              {statusText}
                            </span>
                          </div>

                          {/* Cook Action Button */}
                          <div className="pt-1 flex items-center justify-end gap-2 border-t border-slate-800/60">
                            {item.status !== 'served' && (
                              <button
                                onClick={() => handleAdvanceStatus(order.id, item.id, item.status)}
                                className={`w-full py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                                  item.status === 'pending'
                                    ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                                    : item.status === 'preparing'
                                    ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                              >
                                {item.status === 'pending' ? (
                                  <>
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    Iniciar Preparación
                                  </>
                                ) : item.status === 'preparing' ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Marcar Como Listo
                                  </>
                                ) : (
                                  <>
                                    <Utensils className="w-3.5 h-3.5" />
                                    Marcar Como Servido
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
