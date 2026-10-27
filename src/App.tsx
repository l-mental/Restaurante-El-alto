import React from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { DesktopTitleBar } from './components/DesktopTitleBar';
import { DesktopStatusBar } from './components/DesktopStatusBar';
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
import { useDesktopShortcuts } from './hooks/useDesktopShortcuts';

const MainDesktopLayout: React.FC = () => {
  const { activeTab } = useRestaurant();

  // Activate desktop keyboard shortcuts (F1-F9, Ctrl+B)
  useDesktopShortcuts();

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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* 1. Top Native Desktop Title Bar & Menu Bar */}
      <DesktopTitleBar />

      {/* 2. Middle Work Area: Sidebar + Workspace View */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
          <Header />
          <main className="flex-1 flex flex-col overflow-hidden relative">
            {renderActiveView()}
          </main>
        </div>
      </div>

      {/* 3. Bottom Native Desktop Status Bar */}
      <DesktopStatusBar />
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <MainDesktopLayout />
    </RestaurantProvider>
  );
}
