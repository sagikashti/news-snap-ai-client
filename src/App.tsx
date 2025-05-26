import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        </AppInitializer>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
