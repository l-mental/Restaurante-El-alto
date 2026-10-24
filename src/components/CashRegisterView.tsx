import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Calculator,
  Lock,
  Unlock,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  DollarSign,
  CreditCard,
  QrCode,
  X,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const CashRegisterView: React.FC = () => {
  const {
    cashShift,
    pastShifts,
    settings,
    addCashMovement,
    closeCurrentShift,
    openNewShift,
  } = useRestaurant();

  // New Movement Modal
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<'in' | 'out'>('out');
  const [movementAmount, setMovementAmount] = useState('');
  const [movementConcept, setMovementConcept] = useState('');
  const [movementAuthor, setMovementAuthor] = useState(cashShift.cashierName);

  // Close shift modal
  const [isCloseShiftModalOpen, setIsCloseShiftModalOpen] = useState(false);
  const [countedCash, setCountedCash] = useState('');
  const [closingNotes, setClosingNotes] = useState('');

  // Open shift modal
  const [isOpenShiftModalOpen, setIsOpenShiftModalOpen] = useState(false);
  const [newCashierName, setNewCashierName] = useState('Patricia Silva');
  const [newInitialCash, setNewInitialCash] = useState('250.00');

  // Arqueo calculator
  const [bills, setBills] = useState({
    b100: 0,
    b50: 0,
    b20: 0,
    b10: 0,
    coins: 0,
  });

  const totalCalculatedFromBills =
    bills.b100 * 100 +
    bills.b50 * 50 +
    bills.b20 * 20 +
    bills.b10 * 10 +
    Number(bills.coins || 0);

  const handleApplyCountedToClose = () => {
    setCountedCash(totalCalculatedFromBills.toFixed(2));
  };

  const handleAddMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementAmount || Number(movementAmount) <= 0 || !movementConcept) return;

    addCashMovement(
      movementType,
      Number(movementAmount),
      movementConcept,
      movementAuthor
    );

    setIsMovementModalOpen(false);
    setMovementAmount('');
    setMovementConcept('');
  };

  const handleExecuteCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    closeCurrentShift(Number(countedCash), closingNotes);
    setIsCloseShiftModalOpen(false);
    setCountedCash('');
    setClosingNotes('');
  };

  const handleExecuteOpenShift = (e: React.FormEvent) => {
    e.preventDefault();
    openNewShift(Number(newInitialCash), newCashierName);
    setIsOpenShiftModalOpen(false);
  };

  const totalInMovements = cashShift.movements
    .filter((m) => m.type === 'in')
    .reduce((acc, m) => acc + m.amount, 0);

  const totalOutMovements = cashShift.movements
    .filter((m) => m.type === 'out')
    .reduce((acc, m) => acc + m.amount, 0);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950 p-6 space-y-6">
      {/* Top Banner: Shift Status & Key Metrics */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Wallet className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Turno de Caja Actual
              </h2>
              <span
                className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded border uppercase ${
                  cashShift.status === 'open'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}
              >
                {cashShift.status === 'open' ? 'Activo / Abierto' : 'Cerrado'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Responsable: {cashShift.cashierName} · Apertura: {cashShift.openedAt}
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          {cashShift.status === 'open' ? (
            <>
              <button
                onClick={() => setIsMovementModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
              >
                <ArrowDownLeft className="w-4 h-4 text-amber-400" />
                Ingreso / Retiro
              </button>
              <button
                onClick={() => {
                  setCountedCash(cashShift.expectedCash.toFixed(2));
                  setIsCloseShiftModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-sm"
              >
                <Lock className="w-4 h-4" />
                Arqueo & Cierre de Caja
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsOpenShiftModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors shadow-sm"
            >
              <Unlock className="w-4 h-4" />
              Abrir Nuevo Turno
            </button>
          )}
        </div>
      </div>

      {/* Grid of Cash Balance Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Fondo Inicial de Caja</span>
          <div className="text-2xl font-bold font-mono-numbers text-white">
            {settings.currencySymbol}{cashShift.initialCash.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Apertura de gaveta</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Ventas en Efectivo</span>
          <div className="text-2xl font-bold font-mono-numbers text-emerald-400">
            +{settings.currencySymbol}{cashShift.cashSales.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Cobrado físicamente</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Retiros / Gastos Menores</span>
          <div className="text-2xl font-bold font-mono-numbers text-rose-400">
            -{settings.currencySymbol}{totalOutMovements.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {cashShift.movements.length} salidas registradas
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30">
          <span className="text-xs text-amber-400 block mb-1 font-semibold">
            Efectivo Esperado en Gaveta
          </span>
          <div className="text-2xl font-bold font-mono-numbers text-amber-400">
            {settings.currencySymbol}{cashShift.expectedCash.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Fondo + Ventas - Egresos
          </span>
        </div>
      </div>

      {/* Digital & Non-cash Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            <div>
              <span className="text-xs text-slate-400 block">Ventas Tarjeta (POS)</span>
              <span className="text-base font-bold text-white font-mono-numbers">
                {settings.currencySymbol}{cashShift.cardSales.toFixed(2)}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-indigo-400 font-mono-numbers">Abono Bancario</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QrCode className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs text-slate-400 block">Ventas QR / Billeteras</span>
              <span className="text-base font-bold text-white font-mono-numbers">
                {settings.currencySymbol}{cashShift.qrSales.toFixed(2)}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-amber-400 font-mono-numbers">Transferencias</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-xs text-slate-400 block">Total Facturado Turno</span>
              <span className="text-base font-bold text-white font-mono-numbers">
                {settings.currencySymbol}
                {(cashShift.cashSales + cashShift.cardSales + cashShift.qrSales).toFixed(2)}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">Bruto acumulado</span>
        </div>
      </div>

      {/* Split: Arqueo Calculator & Cash Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Arqueo Calculator */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-sm">
                Calculadora de Arqueo Físico (Billetes & Monedas)
              </h3>
            </div>
            <button
              onClick={() => setBills({ b100: 0, b50: 0, b20: 0, b10: 0, coins: 0 })}
              className="text-xs text-slate-400 hover:text-white"
            >
              Limpiar
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Ingresa la cantidad física contada en la gaveta para cotejar contra el saldo teórico del sistema.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Billetes {settings.currencySymbol}100</span>
              <input
                type="number"
                min="0"
                value={bills.b100 || ''}
                placeholder="0"
                onChange={(e) => setBills({ ...bills, b100: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono-numbers"
              />
              <span className="text-[10px] text-slate-500 mt-1 block text-right font-mono-numbers">
                = {settings.currencySymbol}{bills.b100 * 100}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Billetes {settings.currencySymbol}50</span>
              <input
                type="number"
                min="0"
                value={bills.b50 || ''}
                placeholder="0"
                onChange={(e) => setBills({ ...bills, b50: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono-numbers"
              />
              <span className="text-[10px] text-slate-500 mt-1 block text-right font-mono-numbers">
                = {settings.currencySymbol}{bills.b50 * 50}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Billetes {settings.currencySymbol}20</span>
              <input
                type="number"
                min="0"
                value={bills.b20 || ''}
                placeholder="0"
                onChange={(e) => setBills({ ...bills, b20: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono-numbers"
              />
              <span className="text-[10px] text-slate-500 mt-1 block text-right font-mono-numbers">
                = {settings.currencySymbol}{bills.b20 * 20}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Billetes {settings.currencySymbol}10</span>
              <input
                type="number"
                min="0"
                value={bills.b10 || ''}
                placeholder="0"
                onChange={(e) => setBills({ ...bills, b10: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono-numbers"
              />
              <span className="text-[10px] text-slate-500 mt-1 block text-right font-mono-numbers">
                = {settings.currencySymbol}{bills.b10 * 10}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block mb-1">Monedas Sueltas ({settings.currencySymbol})</span>
              <input
                type="number"
                step="0.1"
                min="0"
                value={bills.coins || ''}
                placeholder="0.00"
                onChange={(e) => setBills({ ...bills, coins: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono-numbers"
              />
              <span className="text-[10px] text-slate-500 mt-1 block text-right font-mono-numbers">
                = {settings.currencySymbol}{Number(bills.coins || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Arqueo Comparison Summary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Físico Contado:</span>
              <span className="text-lg font-bold text-white font-mono-numbers">
                {settings.currencySymbol}{totalCalculatedFromBills.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Saldo Esperado del Sistema:</span>
              <span className="font-mono-numbers">
                {settings.currencySymbol}{cashShift.expectedCash.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center font-bold pt-1.5 border-t border-slate-800">
              <span>Diferencia (Sobrante / Faltante):</span>
              <span
                className={`font-mono-numbers text-sm ${
                  totalCalculatedFromBills - cashShift.expectedCash >= 0
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {totalCalculatedFromBills - cashShift.expectedCash >= 0 ? '+' : ''}
                {settings.currencySymbol}
                {(totalCalculatedFromBills - cashShift.expectedCash).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Cash Movements Ledger */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Registro de Movimientos de Caja</h3>
            <span className="text-xs text-slate-400 font-mono-numbers">
              {cashShift.movements.length} movimientos
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 max-h-80 pr-1">
            {cashShift.movements.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No hay movimientos de caja registrados en este turno.
              </div>
            ) : (
              cashShift.movements.map((mov) => (
                <div
                  key={mov.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        mov.type === 'in'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {mov.type === 'in' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{mov.concept}</div>
                      <div className="text-[10px] text-slate-400">
                        {mov.time} · Por: {mov.author}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-mono-numbers font-bold text-sm ${
                      mov.type === 'in' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {mov.type === 'in' ? '+' : '-'}
                    {settings.currencySymbol}
                    {mov.amount.toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MOVEMENT MODAL */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Registrar Movimiento de Caja</h3>
              <button
                onClick={() => setIsMovementModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMovement} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Tipo de Movimiento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMovementType('out')}
                    className={`py-2 rounded-lg border font-semibold text-center transition-colors ${
                      movementType === 'out'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Salida / Egreso
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementType('in')}
                    className={`py-2 rounded-lg border font-semibold text-center transition-colors ${
                      movementType === 'in'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Entrada / Ingreso
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">
                  Monto ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={movementAmount}
                  onChange={(e) => setMovementAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Concepto / Motivo</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Compra de limones urgentes, propina taxista"
                  value={movementConcept}
                  onChange={(e) => setMovementConcept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Autorizado Por</label>
                <input
                  type="text"
                  value={movementAuthor}
                  onChange={(e) => setMovementAuthor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLOSE SHIFT MODAL */}
      {isCloseShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Cierre de Turno Z & Arqueo</h3>
              <button
                onClick={() => setIsCloseShiftModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleExecuteCloseShift} className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Efectivo Esperado en Sistema:</span>
                  <span className="font-mono-numbers text-white font-bold">
                    {settings.currencySymbol}{cashShift.expectedCash.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">
                  Efectivo Físico Contado ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={countedCash}
                  onChange={(e) => setCountedCash(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers text-sm font-bold"
                />
                {countedCash && (
                  <div className="flex justify-between text-[11px] mt-1 font-mono-numbers">
                    <span className="text-slate-400">Diferencia:</span>
                    <span
                      className={
                        Number(countedCash) - cashShift.expectedCash >= 0
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }
                    >
                      {Number(countedCash) - cashShift.expectedCash >= 0 ? '+' : ''}
                      {settings.currencySymbol}
                      {(Number(countedCash) - cashShift.expectedCash).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">
                  Observaciones de Cierre (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre billetes o justificación de diferencias..."
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCloseShiftModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold"
                >
                  Confirmar Cierre de Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OPEN SHIFT MODAL */}
      {isOpenShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Apertura de Nuevo Turno</h3>
              <button
                onClick={() => setIsOpenShiftModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleExecuteOpenShift} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Cajero Responsable</label>
                <input
                  type="text"
                  required
                  value={newCashierName}
                  onChange={(e) => setNewCashierName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">
                  Fondo Inicial en Gaveta ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newInitialCash}
                  onChange={(e) => setNewInitialCash(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono-numbers"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpenShiftModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Abrir Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
