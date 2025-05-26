import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock environment variables for tests
Object.defineProperty(import.meta, "env", {
  value: {
    DEV: true,
    VITE_API_BASE_URL: "http://localhost:3001",
    VITE_APP_NAME: "NewsSnapAI Client",
    VITE_APP_VERSION: "1.0.0",
  },
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock clipboard API
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve()),
  },
  writable: true,
});
