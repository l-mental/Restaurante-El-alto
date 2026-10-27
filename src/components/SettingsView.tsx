import React, { useState } from 'react';
import {
  Settings,
  Store,
  DollarSign,
  Percent,
  Download,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { RestaurantSettings } from '../types/restaurant';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useRestaurant();
  const [formData, setFormData] = useState<RestaurantSettings>(settings);
  const [isSavedAlert, setIsSavedAlert] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      settings: formData,
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `gourmet_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950 p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Parámetros del Restaurante
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configuración fiscal, datos comerciales, cálculo de márgenes y soporte APK/PWA
          </p>
        </div>

        {isSavedAlert && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Parámetros actualizados correctamente
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Identidad Comercial */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Store className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Datos del Establecimiento
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                Nombre Comercial del Restaurante
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                Razón Social (Facturación)
              </label>
              <input
                type="text"
                required
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                Número de Registro Fiscal (RUC / CIF / NIF / RFC)
              </label>
              <input
                type="text"
                required
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono-numbers focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Teléfono de Contacto</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-slate-300 block mb-1 font-semibold">Dirección Física</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Parámetros Financieros & Fiscales */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Finanzas, Moneda & Costos Operativos
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Moneda Principal</label>
              <select
                value={formData.currency}
                onChange={(e) => {
                  const curr = e.target.value;
                  const sym = curr === 'BOB' ? 'Bs.' : curr === 'USD' ? '$' : curr === 'SOL' ? 'S/.' : curr === 'EUR' ? '€' : '$';
                  setFormData({ ...formData, currency: curr, currencySymbol: sym });
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
              >
                <option value="BOB">Boliviano (Bs.)</option>
                <option value="USD">Dólar Estadounidense ($)</option>
                <option value="SOL">Sol Peruano (S/.)</option>
                <option value="EUR">Euro (€)</option>
                <option value="MXN">Peso Mexicano ($)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Nombre del Impuesto</label>
              <input
                type="text"
                value={formData.taxName}
                onChange={(e) => setFormData({ ...formData, taxName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                Tasa de Impuesto (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.taxRate * 100}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) / 100 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono-numbers"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                Propina Sugerida (%)
              </label>
              <input
                type="number"
                step="1"
                value={formData.tipRate * 100}
                onChange={(e) => setFormData({ ...formData, tipRate: Number(e.target.value) / 100 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono-numbers"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                Costos Fijos Mensuales ({formData.currencySymbol})
              </label>
              <input
                type="number"
                step="100"
                value={formData.monthlyFixedCosts}
                onChange={(e) => setFormData({ ...formData, monthlyFixedCosts: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono-numbers"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Alquiler, sueldos fijos, suministros (base punto de equilibrio)
              </span>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                Meta de Venta Diaria ({formData.currencySymbol})
              </label>
              <input
                type="number"
                step="50"
                value={formData.dailySalesTarget}
                onChange={(e) => setFormData({ ...formData, dailySalesTarget: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono-numbers"
              />
            </div>
          </div>
        </div>

        {/* APK / PWA Mobile info card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Modo APK / Aplicación Móvil para Restaurante
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Este sistema está completamente optimizado para funcionar como APK en dispositivos Android y tablets de comandero (modo pantalla completa, barra lateral colapsable, botones táctiles de 44px+ y respuesta instantánea sin recarga).
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              Respaldar Datos JSON
            </button>
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restablecer Datos Demo
            </button>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            Guardar Parámetros
          </button>
        </div>
      </form>

      {/* CONFIRM RESET MODAL */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">¿Restablecer datos de demostración?</h4>
              <p className="text-xs text-slate-400 mt-1">
                Esto devolverá todas las mesas, inventario, comandas y estaciones a su estado inicial.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
              >
                Sí, Restablecer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
