import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TabLayout } from './shared/components/TabLayout';
import { RoutesPage } from './adapters/ui/RoutesPage';
import { ComparePage } from './adapters/ui/ComparePage';
import { BankingPage } from './adapters/ui/BankingPage';
import { PoolingPage } from './adapters/ui/PoolingPage';
import { BaselineProvider } from './adapters/ui/context/BaselineContext';
import { RoutesProvider } from './adapters/ui/context/RoutesContext';

function App() {
  return (
    <BrowserRouter>
      <RoutesProvider>
        <BaselineProvider>
          <TabLayout>
            <Routes>
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/banking" element={<BankingPage />} />
              <Route path="/pooling" element={<PoolingPage />} />
              <Route path="/" element={<Navigate to="/routes" replace />} />
            </Routes>
          </TabLayout>
        </BaselineProvider>
      </RoutesProvider>
    </BrowserRouter>
  );
}

export default App;
