import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { store } from './app/store';
import { useAppDispatch } from './app/hooks';
import { initializeTheme } from './features/theme/themeSlice';
import ErrorBoundary from './components/ErrorBoundary';
import SummaryPage from './components/SummaryPage';
import './App.css';

// App initialization component
const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize theme on app start
    dispatch(initializeTheme());

    // Add global click handler for toast dismissal
    const handleToastClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const toastElement = target.closest('[data-sonner-toast]');

      if (toastElement && !toastElement.querySelector('[data-sonner-loading]')) {
        // Get toast ID and dismiss it
        const toastId = toastElement.getAttribute('data-sonner-toast');
        if (toastId) {
          toast.dismiss(toastId);
        }
      }
    };

    // Add event listener
    document.addEventListener('click', handleToastClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleToastClick);
    };
  }, [dispatch]);

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppInitializer>
          <Router>
            <div className="app-container">
              <div className="app">
                <Routes>
                  <Route path="/" element={<SummaryPage />} />
                  <Route
                    path="*"
                    element={
                      <div className="app__not-found">
                        <h1>404 - Page Not Found</h1>
                        <p>The page you're looking for doesn't exist.</p>
                        <a href="/" className="app__home-link">
                          Go Home
                        </a>
                      </div>
                    }
                  />
                </Routes>
              </div>
            </div>
          </Router>
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Default options for all toasts
              duration: 4000,
              style: {
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.875rem',
                fontWeight: '500',
                boxShadow: 'var(--shadow-lg)',
                cursor: 'pointer', // Show it's clickable
                maxWidth: '400px',
                wordWrap: 'break-word',
              },
              // Custom styles for different types
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                duration: 6000, // Reasonable duration for errors
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#2563eb',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </AppInitializer>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
