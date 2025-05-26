import { api } from './api';
import { config } from '../config';
import toast from 'react-hot-toast';
import type { SummaryRequest, SummaryResponse, ApiResult, RetryOptions } from '../types';

interface RawApiResponse {
  status: string;
  data: {
    originalUrl: string;
    title: string;
    author: string[];
    date: string;
    publisher: string;
    summary: string;
    originalLength: number;
    summaryLength: number;
  };
}

export function normalizeSummaryResponse(apiResponse: RawApiResponse): ApiResult<SummaryResponse> {
  const rawData = apiResponse?.data;

  if (!rawData) {
    return {
      success: false,
      error: 'Invalid API response structure',
    };
  }

  // Validate required fields
  if (!rawData.summary || !rawData.originalUrl) {
    return {
      success: false,
      error: 'Missing required fields: summary or originalUrl',
    };
  }
  const normalizedData: SummaryResponse = {
    summary: rawData.summary,
    title: rawData.title,
    originalUrl: rawData.originalUrl,
    processedAt: rawData.date || new Date().toISOString(),
    wordCount: rawData.originalLength,
    readingTime: rawData.originalLength ? Math.ceil(rawData.originalLength / 200) : undefined, // estimate: 200 words/min
    author: rawData.author,
    publisher: rawData.publisher,
    summaryLength: rawData.summaryLength,
    // Note: keywords and insights are not provided by the API, so they remain undefined
    keywords: undefined,
    insights: undefined,
  };
  return {
    success: true,
    data: normalizedData,
  };
}

export class SummaryService {
  /**
   * Extract domain name from URL for user feedback
   */
  private static extractDomainName(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'the article';
    }
  }

  /**
   * Summarize content from a URL with enhanced retry logic and user feedback
   * @param request - The summary request containing the URL
   * @returns Promise with the summary response
   */
  static async summarizeUrl(request: SummaryRequest): Promise<ApiResult<SummaryResponse>> {
    // Cancel any existing toasts before starting new request
    toast.dismiss();

    const domainName = this.extractDomainName(request.url);

    // Show initial toast with URL context
    const initialToastId = toast.loading(`📖 Analyzing content from ${domainName}...`, {
      duration: 2000, // Show for 2 seconds minimum
    });

    try {
      // Custom retry options for summary API
      const retryOptions: RetryOptions = {
        maxAttempts: 3,
        delay: 2000, // 2 seconds base delay
        backoff: true, // Exponential backoff
      };

      // Wait longer before transitioning to the next toast (let users read the analysis message)
      setTimeout(() => toast.dismiss(initialToastId), 1500);

      // Small delay to ensure users see the analysis message before API processing starts
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const result = await api.post<RawApiResponse>(
        config.endpoints.summarize,
        request,
        retryOptions
      );

      if (result.success && result.data) {
        return normalizeSummaryResponse(result.data);
      } else {
        return {
          success: false,
          error: 'error' in result ? result.error : 'Failed to get summary from API',
        };
      }
    } catch (error) {
      // Dismiss initial toast on error
      toast.dismiss(initialToastId);
      throw error;
    }
  }

  /**
   * Check API health
   * @returns Promise with health status
   */
  static async checkHealth(): Promise<ApiResult<{ status: string; timestamp: string }>> {
    try {
      return await api.get<{ status: string; timestamp: string }>(config.endpoints.health);
    } catch (error) {
      throw error;
    }
  }
}

export default SummaryService;
