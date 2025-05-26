import { memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { config } from "../config";
import type { BaseComponentProps, UrlFormData } from "../types";

// Zod validation schema
const urlSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .max(
      config.ui.maxUrlLength,
      `URL must be less than ${config.ui.maxUrlLength} characters`,
    )
    .regex(
      config.validation.urlPattern,
      "Please enter a valid URL (http:// or https://)",
    ),
});

interface UrlFormProps extends BaseComponentProps {
  onSubmit: (data: UrlFormData) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

/**
 * URL input form component with validation
 * Uses React Hook Form with Zod validation
 */
export const UrlForm = memo<UrlFormProps>(
  ({
    onSubmit,
    isLoading = false,
    disabled = false,
    placeholder = "Enter article URL (e.g., https://example.com/article)",
    defaultValue = "",
    className = "",
  }) => {
    const {
      register,
      handleSubmit,
      formState: { errors, isValid },
      reset,
      watch,
    } = useForm<UrlFormData>({
      resolver: zodResolver(urlSchema),
      defaultValues: { url: defaultValue },
      mode: "onChange", // Validate on change for better UX
    });

    const urlValue = watch("url");

    const handleFormSubmit = (data: UrlFormData) => {
      onSubmit(data);
    };

    const handleClear = () => {
      reset({ url: "" });
    };

    return (
      <div className={`url-form ${className}`}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="url-form__form"
        >
          <div className="url-form__input-group">
            <div className="url-form__input-wrapper">
              <input
                {...register("url")}
                type="url"
                placeholder={placeholder}
                disabled={disabled || isLoading}
                className={`url-form__input ${errors.url ? "url-form__input--error" : ""}`}
                aria-label="Article URL"
                aria-describedby={errors.url ? "url-error" : undefined}
              />

              {urlValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={disabled || isLoading}
                  className="url-form__clear-button"
                  aria-label="Clear URL"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={disabled || isLoading || !isValid}
              className="url-form__submit-button"
              aria-label="Summarize article"
            >
              {isLoading ? (
                <>
                  <span className="url-form__spinner" aria-hidden="true" />
                  Summarizing...
                </>
              ) : (
                "Summarize"
              )}
            </button>
          </div>

          {errors.url && (
            <div id="url-error" className="url-form__error" role="alert">
              {errors.url.message}
            </div>
          )}
        </form>
      </div>
    );
  },
);

UrlForm.displayName = "UrlForm";

export default UrlForm;
