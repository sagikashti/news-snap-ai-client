import { api } from './api';
import { config } from '../config';
import type { SummaryRequest, SummaryResponse, ApiResult } from '../types';

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
   * Summarize content from a URL
   * @param request - The summary request containing the URL
   * @returns Promise with the summary response
   */
  static async summarizeUrl(request: SummaryRequest): Promise<ApiResult<SummaryResponse>> {
    try {
      const result = await api.post<RawApiResponse>(config.endpoints.summarize, request);

      if (result.success && result.data) {
        return normalizeSummaryResponse(result.data);
      } else {
        return {
          success: false,
          error: 'error' in result ? result.error : 'Failed to get summary from API',
        };
      }
    } catch (error) {
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
