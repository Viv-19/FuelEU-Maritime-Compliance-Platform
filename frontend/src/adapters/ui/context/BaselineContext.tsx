import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BaselineContextType {
  baselineRouteId: string | null;
  setBaselineRouteId: (id: string | null) => void;
}

const BaselineContext = createContext<BaselineContextType | undefined>(undefined);

export const BaselineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [baselineRouteId, setBaselineRouteId] = useState<string | null>(null);

  return (
    <BaselineContext.Provider value={{ baselineRouteId, setBaselineRouteId }}>
      {children}
    </BaselineContext.Provider>
  );
};

export const useBaseline = () => {
  const context = useContext(BaselineContext);
  if (context === undefined) {
    throw new Error('useBaseline must be used within a BaselineProvider');
  }
  return context;
};
