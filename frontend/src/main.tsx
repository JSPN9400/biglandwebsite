import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import HomePage from '@/pages/HomePage';
import EstimatorPage from '@/pages/EstimatorPage';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/estimate" element={<EstimatorPage />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  </StrictMode>,
);
