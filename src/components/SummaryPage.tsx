import { memo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { summarizeUrl, clearError } from '../features/summary/summarySlice';
import UrlForm from './UrlForm';
import SummaryDisplay from './SummaryDisplay';
import LoadingSkeleton from './LoadingSkeleton';
import ThemeToggle from './ThemeToggle';
import type { BaseComponentProps, UrlFormData } from '../types';

interface SummaryPageProps extends BaseComponentProps {}

/**
 * Main summary page component
 * Integrates URL form, summary display, and loading states
 */
export const SummaryPage = memo<SummaryPageProps>(({ className = '' }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error, currentSummary, lastUrl } = useAppSelector((state) => state.summary);
  // Clear error when component mounts
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000); // Auto-clear error after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSubmit = (data: UrlFormData) => {
    dispatch(summarizeUrl(data));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className={`summary-page ${className}`}>
      {/* Header */}
      <header className="summary-page__header">
        <div className="summary-page__header-content">
          <div className="summary-page__branding">
            <h1 className="summary-page__title">NewsSnapAI</h1>
            <p className="summary-page__subtitle">
              Get instant AI-powered summaries of any article a
            </p>
          </div>
          <ThemeToggle className="summary-page__theme-toggle" />
        </div>
      </header>

      {/* Main Content */}
      <main className="summary-page__main">
        <div className="summary-page__container">
          {/* URL Input Form */}
          <section className="summary-page__form-section">
            <UrlForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              className="summary-page__form"
              placeholder="Paste any article URL here (e.g., https://example.com/article)"
            />
          </section>

          {/* Error Display */}
          {error && (
            <section className="summary-page__error-section">
              <div className="summary-page__error" role="alert">
                <div className="summary-page__error-content">
                  <span className="summary-page__error-icon">⚠️</span>
                  <div className="summary-page__error-text">
                    <strong>Error:</strong> {error}
                  </div>
                  <button
                    onClick={handleClearError}
                    className="summary-page__error-close"
                    aria-label="Dismiss error"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Loading State */}
          {isLoading && (
            <section className="summary-page__loading-section">
              <div className="summary-page__loading-header">
                <h2 className="summary-page__loading-title">Analyzing article...</h2>
                <p className="summary-page__loading-subtitle">
                  {lastUrl && `Processing: ${new URL(lastUrl).hostname}`}
                </p>
              </div>
              <LoadingSkeleton variant="summary" className="summary-page__loading-skeleton" />
            </section>
          )}

          {/* Summary Display */}
          {currentSummary && !isLoading && (
            <section className="summary-page__summary-section">
              <SummaryDisplay
                summary={currentSummary}
                className="summary-page__summary"
                onCopy={() => {
                  // Optional: Add analytics or feedback
                  console.log('Summary copied to clipboard');
                }}
              />
            </section>
          )}

          {/* Empty State */}
          {!currentSummary && !isLoading && !error && (
            <section className="summary-page__empty-section">
              <div className="summary-page__empty">
                <div className="summary-page__empty-icon">📰</div>
                <h2 className="summary-page__empty-title">Ready to summarize</h2>
                <p className="summary-page__empty-description">
                  Paste any article URL above to get started. Our AI will analyze the content and
                  provide you with a concise summary, key insights, and important keywords.
                </p>
                <div className="summary-page__empty-features">
                  <div className="summary-page__feature">
                    <span className="summary-page__feature-icon">⚡</span>
                    <span className="summary-page__feature-text">Fast processing</span>
                  </div>
                  <div className="summary-page__feature">
                    <span className="summary-page__feature-icon">🎯</span>
                    <span className="summary-page__feature-text">Key insights</span>
                  </div>
                  <div className="summary-page__feature">
                    <span className="summary-page__feature-icon">🏷️</span>
                    <span className="summary-page__feature-text">Smart keywords</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="summary-page__footer">
        <div className="summary-page__footer-content">
          <p className="summary-page__footer-text">Powered by AI • Built with React & TypeScript</p>
        </div>
      </footer>
    </div>
  );
});

SummaryPage.displayName = 'SummaryPage';

export default SummaryPage;
