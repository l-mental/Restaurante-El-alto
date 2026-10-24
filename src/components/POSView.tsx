import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Users,
  Clock,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  CreditCard,
  QrCode,
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  X,
  Send,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { Table, MenuItem, AreaType, Order, PaymentMethod } from '../types/restaurant';
import { PrintReceiptModal } from './PrintReceiptModal';

export const POSView: React.FC = () => {
  const {
    tables,
    orders,
    menuItems,
    settings,
    createOrder,
    addItemsToOrder,
    payOrder,
    updateTableStatus,
    staff,
  } = useRestaurant();

  const [selectedArea, setSelectedArea] = useState<AreaType | 'all'>('all');
  const [activeTable, setActiveTable] = useState<Table | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart for new or updated order
  const [cartItems, setCartItems] = useState<{ menuItemId: string; quantity: number; notes?: string }[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>('Carlos M.');

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [tipRate, setTipRate] = useState<number>(settings.tipRate);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerTaxId, setCustomerTaxId] = useState<string>('');
  const [invoiceType, setInvoiceType] = useState<'ticket' | 'boleta' | 'factura'>('ticket');

  // Receipt modal state
  const [printedOrder, setPrintedOrder] = useState<Order | null>(null);

  // Filter tables
  const filteredTables = tables.filter((t) => {
    if (selectedArea === 'all') return true;
    return t.area === selectedArea;
  });

  // Current table order
  const activeOrder = activeTable?.currentOrderId
    ? orders.find((o) => o.id === activeTable.currentOrderId && o.status === 'open')
    : null;

  // Filter menu items
  const filteredMenu = menuItems.filter((item) => {
    if (!item.active) return false;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const menuCategories = Array.from(new Set(menuItems.map((m) => m.category)));

  // Cart operations
  const handleAddToCart = (menuItem: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItem.id);
      if (existing) {
        return prev.map((i) => (i.menuItemId === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { menuItemId: menuItem.id, quantity: 1, notes: '' }];
    });
  };

  const handleUpdateCartQuantity = (menuItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.menuItemId === menuItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as { menuItemId: string; quantity: number; notes?: string }[]
    );
  };

  const handleUpdateCartNotes = (menuItemId: string, notes: string) => {
    setCartItems((prev) =>
      prev.map((i) => (i.menuItemId === menuItemId ? { ...i, notes } : i))
    );
  };

  // Open table details
  const handleSelectTable = (table: Table) => {
    setActiveTable(table);
    setCartItems([]);
    if (table.serverName) {
      setSelectedServer(table.serverName);
    }
  };

  // Submit order to kitchen
  const handleSendOrderToKitchen = () => {
    if (!activeTable || cartItems.length === 0) return;

    if (activeOrder) {
      // Add more items to existing order
      addItemsToOrder(activeOrder.id, cartItems);
    } else {
      // Create new order
      createOrder(activeTable.id, cartItems, selectedServer);
    }

    setCartItems([]);
    setActiveTable(null);
  };

  // Open payment modal
  const handleInitiatePayment = () => {
    if (!activeOrder) return;
    setCashReceived((activeOrder.subtotal * (1 + settings.taxRate) * (1 + tipRate)).toFixed(2));
    setIsPaymentModalOpen(true);
  };

  // Confirm payment
  const handleConfirmPayment = () => {
    if (!activeOrder) return;

    const tipAmount = activeOrder.subtotal * tipRate;
    const paid = payOrder(
      activeOrder.id,
      paymentMethod,
      tipAmount,
      customerName,
      customerTaxId,
      invoiceType
    );

    setIsPaymentModalOpen(false);
    setActiveTable(null);

    if (paid) {
      setPrintedOrder(paid);
    }
  };

  // Calculations for current active order + cart
  const cartSubtotal = cartItems.reduce((acc, item) => {
    const mItem = menuItems.find((m) => m.id === item.menuItemId);
    return acc + (mItem ? mItem.price * item.quantity : 0);
  }, 0);

  const tableTotalNow = (activeOrder?.subtotal || 0) + cartSubtotal;
  const tableTaxNow = tableTotalNow * settings.taxRate;
  const tableTipNow = tableTotalNow * tipRate;
  const tableGrandTotalNow = tableTotalNow + tableTaxNow + tableTipNow;

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950">
      {/* LEFT / CENTER: Tables Map & Menu Catalog */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Area Navigation Filter */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg">
            {[
              { id: 'all', label: 'Todas las Mesas' },
              { id: 'salon', label: 'Salón Central' },
              { id: 'terraza', label: 'Terraza' },
              { id: 'barra', label: 'Barra Lounge' },
              { id: 'delivery', label: 'Para Llevar' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedArea(tab.id as AreaType | 'all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedArea === tab.id
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Libre
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Ocupada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              Por Cobrar
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              Reservada
            </span>
          </div>
        </div>

        {/* Content split: Tables Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredTables.map((table) => {
              const order = table.currentOrderId
                ? orders.find((o) => o.id === table.currentOrderId && o.status === 'open')
                : null;

              const isSelected = activeTable?.id === table.id;

              let statusBg = 'bg-slate-900 border-slate-800 hover:border-slate-700';
              let statusBadge = 'text-emerald-400';
              let statusLabel = 'Libre';

              if (table.status === 'occupied') {
                statusBg = 'bg-slate-900/90 border-amber-500/40 hover:border-amber-500';
                statusBadge = 'text-amber-400 font-semibold';
                statusLabel = 'Ocupada';
              } else if (table.status === 'billing') {
                statusBg = 'bg-indigo-950/40 border-indigo-500/50 hover:border-indigo-400';
                statusBadge = 'text-indigo-400 font-semibold';
                statusLabel = 'Por Cobrar';
              } else if (table.status === 'reserved') {
                statusBg = 'bg-slate-900/50 border-slate-800 opacity-75';
                statusBadge = 'text-slate-400';
                statusLabel = 'Reservada';
              }

              return (
                <button
                  key={table.id}
                  onClick={() => handleSelectTable(table)}
                  className={`flex flex-col p-4 rounded-xl border text-left transition-all ${statusBg} ${
                    isSelected ? 'ring-2 ring-amber-400 border-transparent shadow-lg' : ''
                  }`}
                >
                  {/* Table Header */}
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-base font-bold text-white tracking-tight">
                      {table.name}
                    </span>
                    <span className="text-xs font-mono-numbers text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      {table.capacity}
                    </span>
                  </div>

                  {/* Table Subtitle/Area */}
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-3">
                    {table.area}
                  </div>

                  {/* Active Order Snapshot */}
                  <div className="mt-auto pt-2 border-t border-slate-800/80 w-full flex flex-col justify-between text-xs">
                    <div className="flex items-center justify-between">
                      <span className={statusBadge}>{statusLabel}</span>
                      {order && (
                        <span className="font-mono-numbers text-[11px] text-slate-400">
                          {order.createdAt}
                        </span>
                      )}
                    </div>
                    {order ? (
                      <div className="mt-1 flex items-center justify-between font-mono-numbers">
                        <span className="text-slate-400 text-[11px]">
                          {order.items.reduce((acc, i) => acc + i.quantity, 0)} ítems
                        </span>
                        <span className="text-white font-bold text-sm">
                          {settings.currencySymbol}
                          {(order.subtotal * (1 + settings.taxRate)).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 mt-1">Disponible</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Comanda & Menu Panel */}
      {activeTable ? (
        <div className="w-96 lg:w-[460px] border-l border-slate-800 bg-slate-900 flex flex-col shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">{activeTable.name}</h3>
                <span className="text-xs text-slate-400">({activeTable.area})</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Atiende:</span>
                <select
                  value={selectedServer}
                  onChange={(e) => setSelectedServer(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-white"
                >
                  {staff
                    .filter((s) => s.role === 'mesero' || s.role === 'bartender')
                    .map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => setActiveTable(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Items in Kitchen / Order */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Existing Sent Items */}
            {activeOrder && activeOrder.items.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider pb-1 border-b border-slate-800">
                  <span>En Comanda (#{activeOrder.orderNumber})</span>
                  <span>Estado Cocina</span>
                </div>
                {activeOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono-numbers">{item.quantity}x</span>
                        <span className="font-medium text-slate-200">{item.name}</span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-amber-400/90 italic mt-0.5">{item.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-mono-numbers text-white font-semibold">
                        {settings.currencySymbol}
                        {(item.price * item.quantity).toFixed(2)}
                      </div>
                      <span
                        className={`text-[10px] font-mono-numbers uppercase ${
                          item.status === 'ready'
                            ? 'text-emerald-400'
                            : item.status === 'preparing'
                            ? 'text-amber-400'
                            : item.status === 'served'
                            ? 'text-slate-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {item.status === 'ready'
                          ? 'Listo'
                          : item.status === 'preparing'
                          ? 'En Fuego'
                          : item.status === 'served'
                          ? 'Servido'
                          : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pending to Send (Cart) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold uppercase tracking-wider pb-1 border-b border-amber-500/20">
                <span>Platos Nuevos a Agregar</span>
                <span className="font-mono-numbers">{cartItems.length} seleccionados</span>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-800 rounded-lg">
                  Selecciona platos del menú inferior para agregar a la mesa
                </div>
              ) : (
                cartItems.map((cartItem) => {
                  const mItem = menuItems.find((m) => m.id === cartItem.menuItemId);
                  if (!mItem) return null;
                  return (
                    <div
                      key={cartItem.menuItemId}
                      className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{mItem.name}</span>
                        <span className="font-mono-numbers font-semibold text-amber-300">
                          {settings.currencySymbol}
                          {(mItem.price * cartItem.quantity).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-md p-0.5">
                          <button
                            onClick={() => handleUpdateCartQuantity(cartItem.menuItemId, -1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-mono-numbers font-bold text-white text-xs">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateCartQuantity(cartItem.menuItemId, 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Nota (ej. sin sal, término medio)"
                          value={cartItem.notes || ''}
                          onChange={(e) => handleUpdateCartNotes(cartItem.menuItemId, e.target.value)}
                          className="flex-1 ml-2 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => handleUpdateCartQuantity(cartItem.menuItemId, -999)}
                          className="ml-2 text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Menu Catalog to Add Dishes */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar plato o bebida..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Category pills */}
              <div className="flex gap-1 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2.5 py-1 text-[11px] rounded whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Todos
                </button>
                {menuCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-[11px] rounded whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Dish Items Grid */}
              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {filteredMenu.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAddToCart(item)}
                    className="p-2.5 rounded-lg bg-slate-800/70 border border-slate-700/60 hover:border-amber-400 text-left transition-all flex flex-col justify-between group"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-16 object-cover rounded mb-1.5"
                      />
                    )}
                    <span className="font-semibold text-xs text-white group-hover:text-amber-300 line-clamp-1">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {item.station.replace('_', ' ')}
                    </span>
                    <div className="mt-1 flex items-center justify-between font-mono-numbers">
                      <span className="font-bold text-amber-400 text-xs">
                        {settings.currencySymbol}
                        {item.price.toFixed(2)}
                      </span>
                      <span className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-amber-400 group-hover:text-slate-950">
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comanda Footer & Payment Actions */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
            {/* Totals */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono-numbers">
                  {settings.currencySymbol}
                  {tableTotalNow.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{settings.taxName} ({(settings.taxRate * 100).toFixed(0)}%):</span>
                <span className="font-mono-numbers">
                  {settings.currencySymbol}
                  {tableTaxNow.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Propina ({tipRate * 100}%):</span>
                <span className="font-mono-numbers">
                  {settings.currencySymbol}
                  {tableTipNow.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-white text-sm pt-1 border-t border-slate-800">
                <span>Total Estimado:</span>
                <span className="font-mono-numbers text-amber-400 text-base">
                  {settings.currencySymbol}
                  {tableGrandTotalNow.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={cartItems.length === 0}
                onClick={handleSendOrderToKitchen}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4 text-amber-400" />
                Enviar a Cocina
              </button>

              <button
                disabled={!activeOrder}
                onClick={handleInitiatePayment}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <CreditCard className="w-4 h-4" />
                Cobrar Mesa
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State on Right when no table is picked */
        <div className="hidden lg:flex w-80 border-l border-slate-800 bg-slate-900/40 items-center justify-center p-8 text-center">
          <div className="space-y-3 max-w-[220px]">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <UtensilsCrossed className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h4 className="text-sm font-semibold text-white">Selecciona una Mesa</h4>
            <p className="text-xs text-slate-400">
              Haz clic en cualquier mesa para tomar pedidos, enviar platos a cocina o procesar el cobro.
            </p>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {isPaymentModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">
                  Cobrar {activeTable?.name} - Orden #{activeOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  Mesero: {activeOrder.serverName} · {activeOrder.items.length} platos
                </p>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {/* Total Display */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Monto Total a Cobrar
                </span>
                <div className="text-3xl font-extrabold text-amber-400 font-mono-numbers mt-1">
                  {settings.currencySymbol}
                  {(activeOrder.subtotal * (1 + settings.taxRate) + activeOrder.subtotal * tipRate).toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Subtotal: {settings.currencySymbol}{activeOrder.subtotal.toFixed(2)} · {settings.taxName}: {settings.currencySymbol}{(activeOrder.subtotal * settings.taxRate).toFixed(2)}
                </div>
              </div>

              {/* Tip Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Propina para el servicio (Mesonero)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 0.05, 0.10, 0.15].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setTipRate(rate)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors ${
                        tipRate === rate
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                          : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {rate === 0 ? 'Sin Propina' : `${rate * 100}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Método de Pago
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'cash', label: 'Efectivo', icon: DollarSign },
                    { id: 'card', label: 'Tarjeta', icon: CreditCard },
                    { id: 'qr', label: 'QR / Digital', icon: QrCode },
                    { id: 'split', label: 'Mixto 50/50', icon: Receipt },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
                          paymentMethod === m.id
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                            : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cash Calculator if Cash selected */}
              {paymentMethod === 'cash' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Monto Recibido del Cliente
                    </label>
                    <span className="text-xs text-slate-400">Billetes rápidos:</span>
                  </div>
                  <div className="flex gap-2">
                    {[10, 20, 50, 100, 200].map((bill) => (
                      <button
                        key={bill}
                        type="button"
                        onClick={() => setCashReceived(bill.toString())}
                        className="flex-1 py-1 px-2 rounded bg-slate-800 text-xs font-mono-numbers text-slate-300 hover:bg-slate-700"
                      >
                        {settings.currencySymbol}{bill}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="Monto entregado"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono-numbers focus:border-amber-400 focus:outline-none"
                  />
                  {Number(cashReceived) > 0 && (
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Vuelto / Cambio a entregar:</span>
                      <span className="font-mono-numbers font-bold text-emerald-400 text-sm">
                        {settings.currencySymbol}
                        {Math.max(
                          0,
                          Number(cashReceived) -
                            (activeOrder.subtotal * (1 + settings.taxRate) + activeOrder.subtotal * tipRate)
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Invoice Type & Customer (Optional) */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Tipo de Comprobante</label>
                  <select
                    value={invoiceType}
                    onChange={(e) => setInvoiceType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="ticket">Ticket de Venta</option>
                    <option value="boleta">Boleta Electrónica</option>
                    <option value="factura">Factura con RUC/IVA</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Cliente / Empresa (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Nombre o Razón Social"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/20"
              >
                Completar Cobro & Descontar Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT RECEIPT MODAL */}
      {printedOrder && (
        <PrintReceiptModal
          order={printedOrder}
          settings={settings}
          cashGiven={Number(cashReceived) || undefined}
          onClose={() => setPrintedOrder(null)}
        />
      )}
    </div>
  );
};
