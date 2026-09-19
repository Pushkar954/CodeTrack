import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProviderWrapper } from './features/auth/authContext';
import { AppProvider } from './app/AppProvider';
import { Router } from './routes/Router';
import { Toaster } from './components/ui/Toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ClerkProviderWrapper>
          <BrowserRouter>
            <Router />
            <Toaster />
          </BrowserRouter>
        </ClerkProviderWrapper>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
