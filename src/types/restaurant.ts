export type AreaType = 'salon' | 'terraza' | 'barra' | 'delivery';
export type TableStatus = 'free' | 'occupied' | 'billing' | 'reserved';
export type StationType = 'parrilla' | 'cocina_caliente' | 'cocina_fria' | 'bar' | 'postres';
export type OrderItemStatus = 'pending' | 'preparing' | 'ready' | 'served';
export type PaymentMethod = 'cash' | 'card' | 'qr' | 'split';
export type InventoryCategory = 'Carnes' | 'Aves & Pescados' | 'Verduras & Frutas' | 'Lácteos & Quesos' | 'Abarrotes & Especias' | 'Licores & Bebidas' | 'Descartables & Empaques';
export type MenuCategory = 'Entradas' | 'Cortes & Parrilla' | 'Pastas & Arroces' | 'Guarniciones' | 'Coctelería & Vinos' | 'Bebidas sin Alcohol' | 'Postres de Autor';

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: InventoryCategory;
  unit: 'kg' | 'g' | 'L' | 'ml' | 'un';
  currentStock: number;
  minStock: number;
  optimalStock: number;
  unitCost: number; // Costo por unidad
  supplier: string;
  lastUpdated: string;
}

export interface RecipeIngredient {
  inventoryItemId: string;
  quantity: number; // En la unidad del insumo
}

export interface MenuItem {
  id: string;
  code: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  station: StationType;
  active: boolean;
  image?: string;
  recipe: RecipeIngredient[];
}

export interface Table {
  id: string;
  number: number;
  name: string;
  area: AreaType;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  serverName?: string;
  openedAt?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  unitCost: number;
  quantity: number;
  notes?: string;
  status: OrderItemStatus;
  station: StationType;
  orderedAt: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  tableId?: string;
  tableName?: string;
  area?: AreaType;
  serverName: string;
  items: OrderItem[];
  status: 'open' | 'paid' | 'cancelled';
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  costTotal: number; // CMV total
  paymentMethod?: PaymentMethod;
  customerName?: string;
  customerTaxId?: string;
  invoiceType?: 'ticket' | 'boleta' | 'factura';
  createdAt: string;
  paidAt?: string;
}

export interface Workstation {
  id: string;
  code: StationType | 'salon' | 'caja';
  name: string;
  description: string;
  capitalInvestedEquipment: number; // Inversión en equipamiento/maquinaria
  capitalInvestedTools: number; // Inversión en menaje y herramientas
  hourlyOperatingCost: number; // Costo operativo x hora (electricidad, gas, mantenimiento)
  activeStaffCount: number;
  responsibleLead: string;
  status: 'active' | 'standby' | 'cleaning';
}

export interface CashMovement {
  id: string;
  time: string;
  type: 'in' | 'out';
  amount: number;
  concept: string;
  author: string;
}

export interface CashShift {
  id: string;
  openedAt: string;
  closedAt?: string;
  cashierName: string;
  initialCash: number;
  cashSales: number;
  cardSales: number;
  qrSales: number;
  movements: CashMovement[];
  expectedCash: number;
  actualCash?: number;
  difference?: number;
  status: 'open' | 'closed';
  notes?: string;
}

export interface WasteRecord {
  id: string;
  date: string;
  inventoryItemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  reason: 'vencimiento' | 'merma_preparacion' | 'accidente_cocina' | 'calidad_proveedor';
  reportedBy: string;
}

export interface PurchaseRecord {
  id: string;
  date: string;
  invoiceNumber: string;
  supplierName: string;
  items: {
    inventoryItemId: string;
    itemName: string;
    quantity: number;
    unitCost: number;
    subtotal: number;
  }[];
  totalAmount: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'chef' | 'cocinero' | 'bartender' | 'mesero' | 'cajero' | 'administrador';
  stationAssigned: string;
  shift: 'mañana' | 'tarde' | 'noche' | 'completo';
  active: boolean;
  salesCount: number;
  tipsAccumulated: number;
}

export interface RestaurantSettings {
  name: string;
  legalName: string;
  taxId: string;
  address: string;
  phone: string;
  currency: string;
  currencySymbol: string;
  taxName: string;
  taxRate: number; // e.g. 0.18
  tipRate: number; // e.g. 0.10
  monthlyFixedCosts: number; // Alquiler, nóminas fijas, servicios básicos
  dailySalesTarget: number;
}
