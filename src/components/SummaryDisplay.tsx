import { memo, useState } from 'react';
import { formatReadingTime, formatRelativeTime, copyToClipboard } from '../utils';
import type { BaseComponentProps, SummaryResponse } from '../types';

interface SummaryDisplayProps extends BaseComponentProps {
  summary: SummaryResponse;
  onCopy?: () => void;
}

/**
 * Summary display component
 * Shows the summarized content with metadata and actions
 */
export const SummaryDisplay = memo<SummaryDisplayProps>(({ summary, onCopy, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(summary.summary);
      setCopied(true);
      onCopy?.();

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy summary:', error);
    }
  };

  const handleOpenOriginal = () => {
    window.open(summary.originalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`summary-display ${className}`}>
      {/* Header */}
      <div className="summary-display__header">
        {summary.title && <h2 className="summary-display__title">{summary.title}</h2>}

        <div className="summary-display__metadata">
          <span className="summary-display__url">
            <a
              href={summary.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="summary-display__url-link"
            >
              {summary.publisher || new URL(summary.originalUrl).hostname}
            </a>
          </span>

          {summary.author && summary.author.length > 0 && (
            <>
              <span className="summary-display__separator">•</span>
              <span className="summary-display__author">By {summary.author.join(', ')}</span>
            </>
          )}

          <span className="summary-display__separator">•</span>

          <span className="summary-display__time">{formatRelativeTime(summary.processedAt)}</span>

          {summary.wordCount && (
            <>
              <span className="summary-display__separator">•</span>
              <span className="summary-display__reading-time">
                {formatReadingTime(summary.wordCount)}
              </span>
            </>
          )}

          {summary.summaryLength && (
            <>
              <span className="summary-display__separator">•</span>
              <span className="summary-display__summary-length">
                Summary: {summary.summaryLength} words
              </span>
            </>
          )}
        </div>
      </div>

      {/* Summary Content */}
      <div className="summary-display__content">
        <div className="summary-display__summary">
          {summary.summary.split('\n').map(
            (paragraph, index) =>
              paragraph.trim() && (
                <p key={index} className="summary-display__paragraph">
                  {paragraph}
                </p>
              )
          )}
        </div>
      </div>

      {/* Keywords */}
      {summary.keywords && summary.keywords.length > 0 && (
        <div className="summary-display__keywords">
          <h3 className="summary-display__keywords-title">Keywords</h3>
          <div className="summary-display__keywords-list">
            {summary.keywords.map((keyword, index) => (
              <span key={index} className="summary-display__keyword">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {summary.insights && summary.insights.length > 0 && (
        <div className="summary-display__insights">
          <h3 className="summary-display__insights-title">Key Insights</h3>
          <ul className="summary-display__insights-list">
            {summary.insights.map((insight, index) => (
              <li key={index} className="summary-display__insight">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="summary-display__actions">
        <button
          onClick={handleCopy}
          className="summary-display__action-button summary-display__action-button--copy"
          aria-label="Copy summary to clipboard"
        >
          {copied ? (
            <>
              <span className="summary-display__icon">✓</span>
              Copied!
            </>
          ) : (
            <>
              <span className="summary-display__icon">📋</span>
              Copy Summary
            </>
          )}
        </button>

        <button
          onClick={handleOpenOriginal}
          className="summary-display__action-button summary-display__action-button--open"
          aria-label="Open original article"
        >
          <span className="summary-display__icon">🔗</span>
          Read Original
        </button>
      </div>
    </div>
  );
});

SummaryDisplay.displayName = 'SummaryDisplay';

export default SummaryDisplay;
