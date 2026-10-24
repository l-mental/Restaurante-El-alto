import React from 'react';
import { Printer, Download, X, CheckCircle2 } from 'lucide-react';
import { Order, RestaurantSettings } from '../types/restaurant';

interface PrintReceiptModalProps {
  order: Order;
  settings: RestaurantSettings;
  cashGiven?: number;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  order,
  settings,
  cashGiven = 0,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const changeDue = cashGiven > order.total ? cashGiven - order.total : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white text-sm">
              Comprobante de Venta #{order.orderNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Body (Simulating Thermal Paper 80mm) */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/80">
          <div
            id="printable-receipt"
            className="bg-white text-slate-900 p-6 rounded shadow font-mono text-xs max-w-[320px] mx-auto border border-slate-200"
          >
            {/* Business info */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <div className="font-extrabold text-sm uppercase tracking-wide">
                {settings.name}
              </div>
              <div className="text-[10px] text-slate-600 leading-tight mt-1">
                {settings.legalName}
              </div>
              <div className="text-[10px] text-slate-600">
                {settings.taxName} / RUC: {settings.taxId}
              </div>
              <div className="text-[10px] text-slate-600">{settings.address}</div>
              <div className="text-[10px] text-slate-600">Tel: {settings.phone}</div>
            </div>

            {/* Ticket details */}
            <div className="py-2.5 border-b border-dashed border-slate-300 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span>TICKET N°:</span>
                <span className="font-bold">#{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>FECHA / HORA:</span>
                <span>{order.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span>MESA / ZONA:</span>
                <span>{order.tableName} ({order.area?.toUpperCase()})</span>
              </div>
              <div className="flex justify-between">
                <span>ATENDIDO POR:</span>
                <span>{order.serverName}</span>
              </div>
              {order.customerName && (
                <div className="flex justify-between">
                  <span>CLIENTE:</span>
                  <span className="truncate max-w-[150px]">{order.customerName}</span>
                </div>
              )}
              {order.customerTaxId && (
                <div className="flex justify-between">
                  <span>DOC IDENTIDAD:</span>
                  <span>{order.customerTaxId}</span>
                </div>
              )}
            </div>

            {/* Items Header */}
            <div className="py-2 border-b border-dashed border-slate-300">
              <div className="grid grid-cols-12 text-[10px] font-bold text-slate-700 pb-1">
                <span className="col-span-2">CANT</span>
                <span className="col-span-6">DESCRIPCIÓN</span>
                <span className="col-span-4 text-right">IMPORTE</span>
              </div>
              <div className="space-y-1 pt-1 text-[11px]">
                {order.items.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-12">
                    <span className="col-span-2 font-bold">{it.quantity}x</span>
                    <span className="col-span-6 truncate pr-1">{it.name}</span>
                    <span className="col-span-4 text-right">
                      {settings.currencySymbol}{(it.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>SUBTOTAL (Neto):</span>
                <span>{settings.currencySymbol}{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{settings.taxName} ({(settings.taxRate * 100).toFixed(0)}%):</span>
                <span>{settings.currencySymbol}{order.tax.toFixed(2)}</span>
              </div>
              {order.tip > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>PROPINA SERVICIO:</span>
                  <span>{settings.currencySymbol}{order.tip.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-300">
                <span>TOTAL A PAGAR:</span>
                <span>{settings.currencySymbol}{order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment & change */}
            <div className="py-2 border-b border-dashed border-slate-300 text-[10px] text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>FORMA DE PAGO:</span>
                <span className="font-bold uppercase text-slate-900">
                  {order.paymentMethod === 'cash' ? 'EFECTIVO' : order.paymentMethod === 'card' ? 'TARJETA' : order.paymentMethod === 'qr' ? 'QR / BILLETERA' : 'MIXTO'}
                </span>
              </div>
              {order.paymentMethod === 'cash' && cashGiven > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>EFECTIVO RECIBIDO:</span>
                    <span>{settings.currencySymbol}{cashGiven.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>VUELTO / CAMBIO:</span>
                    <span>{settings.currencySymbol}{changeDue.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer barcode/sign */}
            <div className="text-center pt-3 text-[10px] text-slate-500 space-y-1">
              <div className="tracking-widest font-mono text-[9px]">|||| | |||||| ||| ||||||| |||</div>
              <div>¡GRACIAS POR SU PREFERENCIA!</div>
              <div className="text-[9px]">Conserve su comprobante para cualquier consulta.</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-800 bg-slate-950">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Imprimir Ticket Térmico
          </button>
        </div>
      </div>
    </div>
  );
};
