import React, { useState } from 'react';
import {
  Users,
  ChefHat,
  Sparkles,
  Award,
  DollarSign,
  Clock,
  Plus,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { StaffMember } from '../types/restaurant';

export const StaffStationsView: React.FC = () => {
  const { staff, settings, workstations } = useRestaurant();
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredStaff = staff.filter((s) => {
    if (roleFilter === 'all') return true;
    return s.role === roleFilter;
  });

  const totalTipsAll = staff.reduce((acc, s) => acc + s.tipsAccumulated, 0);
  const totalSalesCount = staff.reduce((acc, s) => acc + s.salesCount, 0);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950 p-6 space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Personal en Turno</span>
          <div className="text-2xl font-bold font-mono-numbers text-white">
            {staff.filter((s) => s.active).length} / {staff.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Colaboradores activos</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Estaciones Operativas</span>
          <div className="text-2xl font-bold font-mono-numbers text-amber-400">
            {workstations.filter((w) => w.status === 'active').length} Estaciones
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Cocina, barra y salón</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Comandas Despachadas</span>
          <div className="text-2xl font-bold font-mono-numbers text-emerald-400">
            {totalSalesCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Atendidas por el equipo</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Fondo de Propinas</span>
          <div className="text-2xl font-bold font-mono-numbers text-white">
            {settings.currencySymbol}{totalTipsAll.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Acumulado para el cierre</span>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit text-xs">
        {[
          { id: 'all', label: 'Todo el Personal' },
          { id: 'mesero', label: 'Meseros & Salón' },
          { id: 'chef', label: 'Chef & Cocina' },
          { id: 'bartender', label: 'Bar & Coctelería' },
          { id: 'cajero', label: 'Caja & Administración' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setRoleFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              roleFilter === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{member.name}</h4>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block mt-0.5">
                  {member.role}
                </span>
              </div>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  member.active ? 'bg-emerald-400' : 'bg-slate-600'
                }`}
                title={member.active ? 'Activo en turno' : 'Inactivo'}
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Estación:</span>
                <span className="text-slate-200 font-medium">{member.stationAssigned}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Turno:</span>
                <span className="text-slate-200 capitalize font-medium">{member.shift}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                <span>Mesas / Comandas:</span>
                <span className="font-mono-numbers text-white font-bold">{member.salesCount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Propinas Generadas:</span>
                <span className="font-mono-numbers text-emerald-400 font-bold">
                  {settings.currencySymbol}{member.tipsAccumulated.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
