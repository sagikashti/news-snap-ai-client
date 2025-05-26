import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UrlForm from "../UrlForm";

describe("UrlForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders the form with input and submit button", () => {
    render(<UrlForm onSubmit={mockOnSubmit} />);

    expect(
      screen.getByRole("textbox", { name: /article url/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /summarize article/i }),
    ).toBeInTheDocument();
  });

  it("shows validation error for invalid URL", async () => {
    const user = userEvent.setup();
    render(<UrlForm onSubmit={mockOnSubmit} />);

    const input = screen.getByRole("textbox", { name: /article url/i });
    const submitButton = screen.getByRole("button", {
      name: /summarize article/i,
    });

    await user.type(input, "invalid-url");

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
  });

  it("enables submit button for valid URL", async () => {
    const user = userEvent.setup();
    render(<UrlForm onSubmit={mockOnSubmit} />);

    const input = screen.getByRole("textbox", { name: /article url/i });
    const submitButton = screen.getByRole("button", {
      name: /summarize article/i,
    });

    await user.type(input, "https://example.com/article");

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("calls onSubmit with valid URL", async () => {
    const user = userEvent.setup();
    render(<UrlForm onSubmit={mockOnSubmit} />);

    const input = screen.getByRole("textbox", { name: /article url/i });
    const submitButton = screen.getByRole("button", {
      name: /summarize article/i,
    });

    await user.type(input, "https://example.com/article");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        url: "https://example.com/article",
      });
    });
  });

  it("shows loading state when isLoading is true", () => {
    render(<UrlForm onSubmit={mockOnSubmit} isLoading={true} />);

    expect(screen.getByText(/summarizing/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /summarize article/i }),
    ).toBeDisabled();
  });

  it("shows clear button when input has value", async () => {
    const user = userEvent.setup();
    render(<UrlForm onSubmit={mockOnSubmit} />);

    const input = screen.getByRole("textbox", { name: /article url/i });

    await user.type(input, "https://example.com");

    expect(
      screen.getByRole("button", { name: /clear url/i }),
    ).toBeInTheDocument();
  });

  it("clears input when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<UrlForm onSubmit={mockOnSubmit} />);

    const input = screen.getByRole("textbox", { name: /article url/i });

    await user.type(input, "https://example.com");

    const clearButton = screen.getByRole("button", { name: /clear url/i });
    await user.click(clearButton);

    expect(input).toHaveValue("");
  });
});
