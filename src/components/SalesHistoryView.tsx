import React, { useState } from 'react';
import {
  ReceiptText,
  Search,
  Download,
  Printer,
  Calendar,
  CreditCard,
  DollarSign,
  QrCode,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { Order, PaymentMethod } from '../types/restaurant';
import { PrintReceiptModal } from './PrintReceiptModal';

export const SalesHistoryView: React.FC = () => {
  const { orders, settings } = useRestaurant();
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);

  const paidOrders = orders.filter((o) => o.status === 'paid');

  const filteredOrders = paidOrders.filter((order) => {
    const matchesMethod = methodFilter === 'all' || order.paymentMethod === methodFilter;
    const matchesSearch =
      order.orderNumber.toString().includes(searchQuery) ||
      (order.tableName && order.tableName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.serverName && order.serverName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesMethod && matchesSearch;
  });

  const totalCollected = paidOrders.reduce((acc, o) => acc + o.total, 0);
  const totalSubtotal = paidOrders.reduce((acc, o) => acc + o.subtotal, 0);
  const totalCost = paidOrders.reduce((acc, o) => acc + o.costTotal, 0);
  const totalTips = paidOrders.reduce((acc, o) => acc + o.tip, 0);
  const avgTicket = paidOrders.length > 0 ? totalCollected / paidOrders.length : 0;

  // Export to CSV
  const handleExportCSV = () => {
    if (paidOrders.length === 0) return;
    const headers = ['Nro Ticket', 'Fecha/Hora', 'Mesa', 'Mesero', 'Subtotal', 'Impuesto', 'Propina', 'Total', 'Costo CMV', 'Metodo Pago', 'Cliente'];
    const rows = paidOrders.map((o) => [
      o.orderNumber,
      o.createdAt,
      o.tableName || 'N/A',
      o.serverName,
      o.subtotal.toFixed(2),
      o.tax.toFixed(2),
      o.tip.toFixed(2),
      o.total.toFixed(2),
      o.costTotal.toFixed(2),
      o.paymentMethod || 'Efectivo',
      o.customerName || 'Consumidor Final',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ventas_${settings.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
      {/* Top Metrics Cards */}
      <div className="p-6 pb-4 border-b border-slate-800 bg-slate-900/40">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Total Facturado</span>
            <div className="text-2xl font-bold font-mono-numbers text-white">
              {settings.currencySymbol}{totalCollected.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {paidOrders.length} tickets emitidos
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Ticket Promedio</span>
            <div className="text-2xl font-bold font-mono-numbers text-amber-400">
              {settings.currencySymbol}{avgTicket.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Por mesa atendida</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Costo CMV Total</span>
            <div className="text-2xl font-bold font-mono-numbers text-rose-400">
              {settings.currencySymbol}{totalCost.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {totalSubtotal > 0 ? ((totalCost / totalSubtotal) * 100).toFixed(1) : 0}% food cost real
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Propinas del Equipo</span>
            <div className="text-2xl font-bold font-mono-numbers text-emerald-400">
              {settings.currencySymbol}{totalTips.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">A distribuir al personal</span>
          </div>
        </div>
      </div>

      {/* Filter and Export Bar */}
      <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por ticket, mesa, mesero o cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Method filter buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60 text-xs">
            {(['all', 'cash', 'card', 'qr', 'split'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethodFilter(m)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  methodFilter === m
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'all'
                  ? 'Todos'
                  : m === 'cash'
                  ? 'Efectivo'
                  : m === 'card'
                  ? 'Tarjeta'
                  : m === 'qr'
                  ? 'QR'
                  : 'Mixto'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">TICKET</th>
                <th className="py-3 px-4">HORA</th>
                <th className="py-3 px-4">MESA</th>
                <th className="py-3 px-4">MESERO</th>
                <th className="py-3 px-4">ÍTEMS</th>
                <th className="py-3 px-4 text-right">SUBTOTAL</th>
                <th className="py-3 px-4 text-right">PROPINA</th>
                <th className="py-3 px-4 text-right">TOTAL PAGADO</th>
                <th className="py-3 px-4">MÉTODO</th>
                <th className="py-3 px-4 text-center">REIMPRIMIR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-500">
                    No hay ventas registradas que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 text-slate-300">
                    <td className="py-3 px-4 font-mono-numbers font-bold text-amber-400">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-mono-numbers text-slate-400">
                      {order.paidAt || order.createdAt}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {order.tableName || 'Para Llevar'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{order.serverName}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} platos
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers text-slate-300">
                      {settings.currencySymbol}{order.subtotal.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers text-emerald-400">
                      {settings.currencySymbol}{order.tip.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers font-bold text-white">
                      {settings.currencySymbol}{order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 uppercase text-[11px] font-semibold text-slate-400">
                      {order.paymentMethod || 'Efectivo'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedOrderForPrint(order)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                        title="Reimprimir ticket de venta"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT RECEIPT MODAL */}
      {selectedOrderForPrint && (
        <PrintReceiptModal
          order={selectedOrderForPrint}
          settings={settings}
          onClose={() => setSelectedOrderForPrint(null)}
        />
      )}
    </div>
  );
};
