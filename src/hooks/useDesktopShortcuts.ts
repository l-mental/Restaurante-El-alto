import { useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';

export const useDesktopShortcuts = () => {
  const { setActiveTab, setIsSidebarCollapsed } = useRestaurant();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept function keys if user is typing inside an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      // Ctrl + B: Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
        return;
      }

      // Function keys F1 - F9
      if (!isInput) {
        switch (e.key) {
          case 'F1':
            e.preventDefault();
            setActiveTab('pos');
            break;
          case 'F2':
            e.preventDefault();
            setActiveTab('kds');
            break;
          case 'F3':
            e.preventDefault();
            setActiveTab('inventory');
            break;
          case 'F4':
            e.preventDefault();
            setActiveTab('recipes');
            break;
          case 'F5':
            e.preventDefault();
            setActiveTab('capital');
            break;
          case 'F6':
            e.preventDefault();
            setActiveTab('cash');
            break;
          case 'F7':
            e.preventDefault();
            setActiveTab('sales');
            break;
          case 'F8':
            e.preventDefault();
            setActiveTab('staff');
            break;
          case 'F9':
            e.preventDefault();
            setActiveTab('settings');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab, setIsSidebarCollapsed]);
};
