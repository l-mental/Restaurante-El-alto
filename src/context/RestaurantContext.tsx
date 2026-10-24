import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  InventoryItem,
  MenuItem,
  Table,
  Workstation,
  Order,
  OrderItem,
  CashShift,
  RestaurantSettings,
  StaffMember,
  WasteRecord,
  PaymentMethod,
  OrderItemStatus,
  TableStatus,
} from '../types/restaurant';
import {
  initialSettings,
  initialInventory,
  initialMenuItems,
  initialTables,
  initialOrders,
  initialWorkstations,
  initialCashShift,
  initialWastes,
  initialStaff,
} from '../data/mockData';

interface RestaurantContextType {
  settings: RestaurantSettings;
  inventory: InventoryItem[];
  menuItems: MenuItem[];
  tables: Table[];
  orders: Order[];
  workstations: Workstation[];
  cashShift: CashShift;
  pastShifts: CashShift[];
  wastes: WasteRecord[];
  staff: StaffMember[];
  activeTab: string;
  isSidebarCollapsed: boolean;
  soundAlerts: boolean;
  setActiveTab: (tab: string) => void;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  setSoundAlerts: (enabled: boolean) => void;
  
  // Table & Order management
  createOrder: (tableId: string, items: { menuItemId: string; quantity: number; notes?: string }[], serverName: string) => Order | null;
  addItemsToOrder: (orderId: string, newItems: { menuItemId: string; quantity: number; notes?: string }[]) => void;
  updateOrderItemStatus: (orderId: string, itemId: string, newStatus: OrderItemStatus) => void;
  payOrder: (
    orderId: string,
    paymentMethod: PaymentMethod,
    tip: number,
    customerName?: string,
    customerTaxId?: string,
    invoiceType?: 'ticket' | 'boleta' | 'factura'
  ) => Order | null;
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  cancelOrder: (orderId: string) => void;

  // Inventory & Recipes
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;
  registerStockPurchase: (inventoryItemId: string, addedQuantity: number, unitCost: number, supplierName: string) => void;
  registerWaste: (waste: Omit<WasteRecord, 'id' | 'date'>) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;

  // Workstations & Capital
  updateWorkstation: (station: Workstation) => void;

  // Cash shift
  addCashMovement: (type: 'in' | 'out', amount: number, concept: string, author: string) => void;
  closeCurrentShift: (actualCash: number, notes?: string) => void;
  openNewShift: (initialCash: number, cashierName: string) => void;

  // Settings & Reset
  updateSettings: (newSettings: RestaurantSettings) => void;
  resetAllData: () => void;
  
  // Financial computed metrics
  financials: {
    capitalInvestedStock: number;
    capitalInvestedStations: number;
    totalCapitalInvested: number;
    capitalExpectedSalesValue: number;
    expectedGrossProfit: number;
    expectedGrossMarginPct: number;
    totalTodaySales: number;
    totalTodayCost: number;
    totalTodayGrossProfit: number;
    todayGrossMarginPct: number;
    dailyBreakEvenSales: number;
    dailyFixedCosts: number;
    netProfitToday: number;
  };
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'gourmet_os_restaurant_state_v1';

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_inventory`);
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_menu`);
    return saved ? JSON.parse(saved) : initialMenuItems;
  });

  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tables`);
    return saved ? JSON.parse(saved) : initialTables;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [workstations, setWorkstations] = useState<Workstation[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_workstations`);
    return saved ? JSON.parse(saved) : initialWorkstations;
  });

  const [cashShift, setCashShift] = useState<CashShift>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cashShift`);
    return saved ? JSON.parse(saved) : initialCashShift;
  });

  const [pastShifts, setPastShifts] = useState<CashShift[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_pastShifts`);
    return saved ? JSON.parse(saved) : [];
  });

  const [wastes, setWastes] = useState<WasteRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_wastes`);
    return saved ? JSON.parse(saved) : initialWastes;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_staff`);
    return saved ? JSON.parse(saved) : initialStaff;
  });

  const [activeTab, setActiveTab] = useState<string>('pos');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [soundAlerts, setSoundAlerts] = useState<boolean>(true);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(settings));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_inventory`, JSON.stringify(inventory));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_menu`, JSON.stringify(menuItems));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_tables`, JSON.stringify(tables));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_orders`, JSON.stringify(orders));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_workstations`, JSON.stringify(workstations));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_cashShift`, JSON.stringify(cashShift));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_pastShifts`, JSON.stringify(pastShifts));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_wastes`, JSON.stringify(wastes));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_staff`, JSON.stringify(staff));
  }, [settings, inventory, menuItems, tables, orders, workstations, cashShift, pastShifts, wastes, staff]);

  // Recalculate menu items unit cost whenever inventory costs change
  const calculateDishCost = (recipe: { inventoryItemId: string; quantity: number }[]) => {
    return recipe.reduce((acc, ing) => {
      const invItem = inventory.find((i) => i.id === ing.inventoryItemId);
      if (!invItem) return acc;
      return acc + invItem.unitCost * ing.quantity;
    }, 0);
  };

  // Create Order
  const createOrder = (
    tableId: string,
    itemsToAdd: { menuItemId: string; quantity: number; notes?: string }[],
    serverName: string
  ): Order | null => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return null;

    const currentTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    let subtotal = 0;
    let costTotal = 0;

    const orderItems: OrderItem[] = itemsToAdd.map((entry, idx) => {
      const mItem = menuItems.find((m) => m.id === entry.menuItemId);
      const name = mItem ? mItem.name : 'Plato';
      const price = mItem ? mItem.price : 0;
      const unitCost = mItem ? calculateDishCost(mItem.recipe) : 0;
      const station = mItem ? mItem.station : 'cocina_caliente';

      subtotal += price * entry.quantity;
      costTotal += unitCost * entry.quantity;

      return {
        id: `item-${Date.now()}-${idx}`,
        menuItemId: entry.menuItemId,
        name,
        price,
        unitCost,
        quantity: entry.quantity,
        notes: entry.notes || '',
        status: 'pending',
        station,
        orderedAt: currentTime,
      };
    });

    const tax = subtotal * settings.taxRate;
    const tip = subtotal * settings.tipRate;
    const total = subtotal + tax + tip;
    const newOrderNumber = 1000 + orders.length + 1;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      tableId,
      tableName: table.name,
      area: table.area,
      serverName,
      items: orderItems,
      status: 'open',
      subtotal,
      tax,
      tip,
      total,
      costTotal,
      createdAt: currentTime,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update table status
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status: 'occupied',
              currentOrderId: newOrder.id,
              serverName,
              openedAt: currentTime,
            }
          : t
      )
    );

    return newOrder;
  };

  // Add more items to existing order
  const addItemsToOrder = (orderId: string, newItems: { menuItemId: string; quantity: number; notes?: string }[]) => {
    const currentTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        let addedSubtotal = 0;
        let addedCost = 0;

        const generatedItems: OrderItem[] = newItems.map((entry, idx) => {
          const mItem = menuItems.find((m) => m.id === entry.menuItemId);
          const name = mItem ? mItem.name : 'Plato';
          const price = mItem ? mItem.price : 0;
          const unitCost = mItem ? calculateDishCost(mItem.recipe) : 0;
          const station = mItem ? mItem.station : 'cocina_caliente';

          addedSubtotal += price * entry.quantity;
          addedCost += unitCost * entry.quantity;

          return {
            id: `item-${Date.now()}-${idx}`,
            menuItemId: entry.menuItemId,
            name,
            price,
            unitCost,
            quantity: entry.quantity,
            notes: entry.notes || '',
            status: 'pending',
            station,
            orderedAt: currentTime,
          };
        });

        const newSubtotal = order.subtotal + addedSubtotal;
        const newTax = newSubtotal * settings.taxRate;
        const newTip = newSubtotal * settings.tipRate;
        const newTotal = newSubtotal + newTax + newTip;

        return {
          ...order,
          items: [...order.items, ...generatedItems],
          subtotal: newSubtotal,
          tax: newTax,
          tip: newTip,
          total: newTotal,
          costTotal: order.costTotal + addedCost,
        };
      })
    );
  };

  // Update Item Status in Kitchen (KDS)
  const updateOrderItemStatus = (orderId: string, itemId: string, newStatus: OrderItemStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          items: ord.items.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item)),
        };
      })
    );
  };

  // Pay and close order -> Deducts stock automatically!
  const payOrder = (
    orderId: string,
    paymentMethod: PaymentMethod,
    tip: number,
    customerName?: string,
    customerTaxId?: string,
    invoiceType: 'ticket' | 'boleta' | 'factura' = 'ticket'
  ): Order | null => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    const paidTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const finalTotal = order.subtotal + order.tax + tip;

    // 1. Deduct stock for all items in order based on recipes
    setInventory((prevInv) => {
      const updated = [...prevInv];
      order.items.forEach((item) => {
        const menuItem = menuItems.find((m) => m.id === item.menuItemId);
        if (menuItem && menuItem.recipe) {
          menuItem.recipe.forEach((ing) => {
            const targetIdx = updated.findIndex((inv) => inv.id === ing.inventoryItemId);
            if (targetIdx !== -1) {
              const needed = ing.quantity * item.quantity;
              const newStock = Math.max(0, Number((updated[targetIdx].currentStock - needed).toFixed(3)));
              updated[targetIdx] = {
                ...updated[targetIdx],
                currentStock: newStock,
                lastUpdated: new Date().toISOString().split('T')[0],
              };
            }
          });
        }
      });
      return updated;
    });

    // 2. Update cash shift totals
    setCashShift((prevShift) => {
      let cashSales = prevShift.cashSales;
      let cardSales = prevShift.cardSales;
      let qrSales = prevShift.qrSales;

      if (paymentMethod === 'cash') cashSales += finalTotal;
      else if (paymentMethod === 'card') cardSales += finalTotal;
      else if (paymentMethod === 'qr') qrSales += finalTotal;
      else {
        // Split: half cash half card
        cashSales += finalTotal / 2;
        cardSales += finalTotal / 2;
      }

      const expectedCash = prevShift.initialCash + cashSales - prevShift.movements.reduce((acc, m) => (m.type === 'out' ? acc + m.amount : acc - m.amount), 0);

      return {
        ...prevShift,
        cashSales,
        cardSales,
        qrSales,
        expectedCash,
      };
    });

    // 3. Mark order as paid
    const updatedOrder: Order = {
      ...order,
      tip,
      total: finalTotal,
      status: 'paid',
      paymentMethod,
      customerName,
      customerTaxId,
      invoiceType,
      paidAt: paidTime,
    };

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));

    // 4. Free the table
    if (order.tableId) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === order.tableId
            ? {
                ...t,
                status: 'free',
                currentOrderId: undefined,
                serverName: undefined,
                openedAt: undefined,
              }
            : t
        )
      );
    }

    // 5. Update waiter metrics
    if (order.serverName) {
      setStaff((prev) =>
        prev.map((st) =>
          st.name.toLowerCase().includes(order.serverName.toLowerCase().split(' ')[0])
            ? {
                ...st,
                salesCount: st.salesCount + 1,
                tipsAccumulated: st.tipsAccumulated + tip,
              }
            : st
        )
      );
    }

    return updatedOrder;
  };

  const updateTableStatus = (tableId: string, status: TableStatus) => {
    setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, status } : t)));
  };

  const cancelOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o)));

    if (order.tableId) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === order.tableId
            ? {
                ...t,
                status: 'free',
                currentOrderId: undefined,
                serverName: undefined,
                openedAt: undefined,
              }
            : t
        )
      );
    }
  };

  // Inventory actions
  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setInventory((prev) => [newItem, ...prev]);
  };

  const updateInventoryItem = (item: InventoryItem) => {
    setInventory((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...item,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : i
      )
    );
  };

  const deleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
  };

  const registerStockPurchase = (
    inventoryItemId: string,
    addedQuantity: number,
    unitCost: number,
    supplierName: string
  ) => {
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.id !== inventoryItemId) return inv;
        // Costo promedio ponderado
        const totalOldCost = inv.currentStock * inv.unitCost;
        const totalNewCost = addedQuantity * unitCost;
        const newTotalStock = inv.currentStock + addedQuantity;
        const weightedCost = newTotalStock > 0 ? (totalOldCost + totalNewCost) / newTotalStock : unitCost;

        return {
          ...inv,
          currentStock: Number(newTotalStock.toFixed(3)),
          unitCost: Number(weightedCost.toFixed(2)),
          supplier: supplierName || inv.supplier,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  const registerWaste = (wasteData: Omit<WasteRecord, 'id' | 'date'>) => {
    const newWaste: WasteRecord = {
      ...wasteData,
      id: `waste-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setWastes((prev) => [newWaste, ...prev]);

    // Deduct from stock
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== wasteData.inventoryItemId) return item;
        return {
          ...item,
          currentStock: Math.max(0, Number((item.currentStock - wasteData.quantity).toFixed(3))),
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  // Menu items actions
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
    };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => prev.map((m) => (m.id === item.id ? item : m)));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
  };

  // Workstation
  const updateWorkstation = (station: Workstation) => {
    setWorkstations((prev) => prev.map((ws) => (ws.id === station.id ? station : ws)));
  };

  // Cash Shift
  const addCashMovement = (type: 'in' | 'out', amount: number, concept: string, author: string) => {
    const newMovement = {
      id: `mov-${Date.now()}`,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      type,
      amount,
      concept,
      author,
    };

    setCashShift((prev) => {
      const netMovement = type === 'in' ? amount : -amount;
      return {
        ...prev,
        movements: [newMovement, ...prev.movements],
        expectedCash: prev.expectedCash + netMovement,
      };
    });
  };

  const closeCurrentShift = (actualCash: number, notes?: string) => {
    const closedShift: CashShift = {
      ...cashShift,
      closedAt: new Date().toLocaleString('es-ES'),
      actualCash,
      difference: actualCash - cashShift.expectedCash,
      status: 'closed',
      notes,
    };

    setPastShifts((prev) => [closedShift, ...prev]);
    setCashShift(closedShift);
  };

  const openNewShift = (initialCash: number, cashierName: string) => {
    const newShift: CashShift = {
      id: `shift-${Date.now()}`,
      openedAt: new Date().toLocaleString('es-ES'),
      cashierName,
      initialCash,
      cashSales: 0,
      cardSales: 0,
      qrSales: 0,
      movements: [],
      expectedCash: initialCash,
      status: 'open',
    };
    setCashShift(newShift);
  };

  const updateSettings = (newSettings: RestaurantSettings) => {
    setSettings(newSettings);
  };

  const resetAllData = () => {
    localStorage.clear();
    setSettings(initialSettings);
    setInventory(initialInventory);
    setMenuItems(initialMenuItems);
    setTables(initialTables);
    setOrders(initialOrders);
    setWorkstations(initialWorkstations);
    setCashShift(initialCashShift);
    setPastShifts([]);
    setWastes(initialWastes);
    setStaff(initialStaff);
  };

  // ==========================================
  // FINANCIAL METRICS CALCULATION
  // ==========================================
  // 1. Capital Invertido en Stock
  const capitalInvestedStock = inventory.reduce((acc, item) => acc + item.currentStock * item.unitCost, 0);

  // 2. Capital Invertido en Estaciones de Trabajo (Equipos + Herramientas)
  const capitalInvestedStations = workstations.reduce(
    (acc, ws) => acc + ws.capitalInvestedEquipment + ws.capitalInvestedTools,
    0
  );

  const totalCapitalInvested = capitalInvestedStock + capitalInvestedStations;

  // 3. Capital Esperado (Valor de venta proyectado del stock actual)
  // Calculamos el multiplicador promedio del menú (Venta / Costo)
  const menuCostRatios = menuItems
    .map((m) => {
      const cost = calculateDishCost(m.recipe);
      return cost > 0 ? m.price / cost : 3.0; // Promedio estándar gastronómico x3 (33% food cost)
    })
    .filter((r) => r > 0);

  const avgMarkup = menuCostRatios.length > 0 ? menuCostRatios.reduce((a, b) => a + b, 0) / menuCostRatios.length : 3.2;

  const capitalExpectedSalesValue = capitalInvestedStock * avgMarkup;
  const expectedGrossProfit = capitalExpectedSalesValue - capitalInvestedStock;
  const expectedGrossMarginPct = capitalExpectedSalesValue > 0 ? (expectedGrossProfit / capitalExpectedSalesValue) * 100 : 0;

  // 4. Ventas reales de hoy (órdenes pagadas)
  const paidOrders = orders.filter((o) => o.status === 'paid');
  const totalTodaySales = paidOrders.reduce((acc, o) => acc + o.subtotal, 0);
  const totalTodayCost = paidOrders.reduce((acc, o) => acc + o.costTotal, 0);
  const totalTodayGrossProfit = totalTodaySales - totalTodayCost;
  const todayGrossMarginPct = totalTodaySales > 0 ? (totalTodayGrossProfit / totalTodaySales) * 100 : 0;

  // 5. Costos fijos diarios y Punto de Equilibrio
  const dailyFixedCosts = settings.monthlyFixedCosts / 30;
  // Margen de contribución esperado en decimal
  const avgContributionMargin = expectedGrossMarginPct > 0 ? expectedGrossMarginPct / 100 : 0.65;
  const dailyBreakEvenSales = dailyFixedCosts / (avgContributionMargin || 0.65);
  const netProfitToday = totalTodayGrossProfit - dailyFixedCosts;

  const financials = {
    capitalInvestedStock,
    capitalInvestedStations,
    totalCapitalInvested,
    capitalExpectedSalesValue,
    expectedGrossProfit,
    expectedGrossMarginPct,
    totalTodaySales,
    totalTodayCost,
    totalTodayGrossProfit,
    todayGrossMarginPct,
    dailyBreakEvenSales,
    dailyFixedCosts,
    netProfitToday,
  };

  return (
    <RestaurantContext.Provider
      value={{
        settings,
        inventory,
        menuItems,
        tables,
        orders,
        workstations,
        cashShift,
        pastShifts,
        wastes,
        staff,
        activeTab,
        isSidebarCollapsed,
        soundAlerts,
        setActiveTab,
        setIsSidebarCollapsed,
        setSoundAlerts,
        createOrder,
        addItemsToOrder,
        updateOrderItemStatus,
        payOrder,
        updateTableStatus,
        cancelOrder,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        registerStockPurchase,
        registerWaste,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateWorkstation,
        addCashMovement,
        closeCurrentShift,
        openNewShift,
        updateSettings,
        resetAllData,
        financials,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
