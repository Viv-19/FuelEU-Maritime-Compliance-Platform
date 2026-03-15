import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Route } from '../../../core/domain/Route';
import { apiGet } from '../../infrastructure/apiClient';

interface RoutesContextType {
  routes: Route[];
  loading: boolean;
  error: string | null;
  fetchRoutes: () => Promise<void>;
  selectedShipId: string;
  setSelectedShipId: (id: string) => void;
  shipIds: string[];
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

export const RoutesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShipId, setSelectedShipId] = useState<string>('');

  const isMounted = React.useRef(true);

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchRoutes = useCallback(async () => {
    try {
      if (!isMounted.current) return;
      setLoading(true);
      setError(null);
      const res = await apiGet('/routes');
      if (res.success && Array.isArray(res.data)) {
        if (isMounted.current) setRoutes(res.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      if (isMounted.current) setError(err.message || 'Failed to load routes');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const shipIds = useMemo(
    () => Array.from(new Set(routes.map((r) => r.shipId))).sort(),
    [routes]
  );

  const value = useMemo(
    () => ({
      routes,
      loading,
      error,
      fetchRoutes,
      selectedShipId,
      setSelectedShipId,
      shipIds,
    }),
    [routes, loading, error, fetchRoutes, selectedShipId, shipIds]
  );

  return <RoutesContext.Provider value={value}>{children}</RoutesContext.Provider>;
};

export const useRoutes = () => {
  const context = useContext(RoutesContext);
  if (context === undefined) {
    throw new Error('useRoutes must be used within a RoutesProvider');
  }
  return context;
};
