import { createContext, useContext } from 'react';

interface AppContextType {
  // Will be populated in future phases
}

export const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
