import { memo } from "react";
import type { BaseComponentProps } from "../types";

interface LoadingSkeletonProps extends BaseComponentProps {
  variant?: "summary" | "card" | "text" | "button";
  lines?: number;
  height?: string;
  width?: string;
}

/**
 * Loading skeleton component for better loading UX
 * Provides different variants for different content types
 */
export const LoadingSkeleton = memo<LoadingSkeletonProps>(
  ({
    variant = "text",
    lines = 3,
    height = "1rem",
    width = "100%",
    className = "",
  }) => {
    const renderSkeleton = () => {
      switch (variant) {
        case "summary":
          return (
            <div className="loading-skeleton loading-skeleton--summary">
              {/* Title skeleton */}
              <div className="loading-skeleton__item loading-skeleton__item--title" />

              {/* Metadata skeleton */}
              <div className="loading-skeleton__metadata">
                <div className="loading-skeleton__item loading-skeleton__item--metadata" />
                <div className="loading-skeleton__item loading-skeleton__item--metadata" />
                <div className="loading-skeleton__item loading-skeleton__item--metadata" />
              </div>

              {/* Content skeleton */}
              <div className="loading-skeleton__content">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className={`loading-skeleton__item loading-skeleton__item--paragraph ${index === 3 ? "loading-skeleton__item--paragraph-short" : ""}`}
                  />
                ))}
              </div>

              {/* Keywords skeleton */}
              <div className="loading-skeleton__keywords">
                <div className="loading-skeleton__item loading-skeleton__item--section-title" />
                <div className="loading-skeleton__keywords-list">
                  {Array.from({ length: 5 }, (_, index) => (
                    <div
                      key={index}
                      className="loading-skeleton__item loading-skeleton__item--keyword"
                    />
                  ))}
                </div>
              </div>

              {/* Actions skeleton */}
              <div className="loading-skeleton__actions">
                <div className="loading-skeleton__item loading-skeleton__item--button" />
                <div className="loading-skeleton__item loading-skeleton__item--button" />
              </div>
            </div>
          );

        case "card":
          return (
            <div className="loading-skeleton loading-skeleton--card">
              <div className="loading-skeleton__item loading-skeleton__item--card-title" />
              <div className="loading-skeleton__item loading-skeleton__item--card-subtitle" />
              <div className="loading-skeleton__item loading-skeleton__item--card-content" />
            </div>
          );

        case "button":
          return (
            <div
              className="loading-skeleton loading-skeleton--button"
              style={{ height, width }}
            >
              <div className="loading-skeleton__item loading-skeleton__item--button" />
            </div>
          );

        case "text":
        default:
          return (
            <div className="loading-skeleton loading-skeleton--text">
              {Array.from({ length: lines }, (_, index) => (
                <div
                  key={index}
                  className={`loading-skeleton__item loading-skeleton__item--text ${index === lines - 1 ? "loading-skeleton__item--text-short" : ""}`}
                  style={{ height }}
                />
              ))}
            </div>
          );
      }
    };

    return (
      <div
        className={`loading-skeleton-wrapper ${className}`}
        aria-label="Loading content"
      >
        {renderSkeleton()}
      </div>
    );
  },
);

LoadingSkeleton.displayName = "LoadingSkeleton";

export default LoadingSkeleton;
