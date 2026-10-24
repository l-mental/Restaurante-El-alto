import React from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { POSView } from './components/POSView';
import { KDSView } from './components/KDSView';
import { InventoryView } from './components/InventoryView';
import { RecipeEscandalloView } from './components/RecipeEscandalloView';
import { CapitalFinanceView } from './components/CapitalFinanceView';
import { SalesHistoryView } from './components/SalesHistoryView';
import { CashRegisterView } from './components/CashRegisterView';
import { StaffStationsView } from './components/StaffStationsView';
import { SettingsView } from './components/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab } = useRestaurant();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'pos':
        return <POSView />;
      case 'kds':
        return <KDSView />;
      case 'inventory':
        return <InventoryView />;
      case 'recipes':
        return <RecipeEscandalloView />;
      case 'capital':
        return <CapitalFinanceView />;
      case 'sales':
        return <SalesHistoryView />;
      case 'cash':
        return <CashRegisterView />;
      case 'staff':
        return <StaffStationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <POSView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Required Lateral Bar (Barra Lateral) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <MainLayout />
    </RestaurantProvider>
  );
}
