import type {
  CrossrefJournalArticleMetadata,
  CrossrefDepositResponse,
  DoiRegistrationResult,
  CrossrefConfig,
} from './types';

/**
 * Crossref API client for DOI registration
 */
export class CrossrefClient {
  private config: CrossrefConfig;
  private authHeader: string;

  constructor(config?: Partial<CrossrefConfig>) {
    this.config = {
      username: process.env.CROSSREF_USERNAME || '',
      password: process.env.CROSSREF_PASSWORD || '',
      prefix: process.env.CROSSREF_DOI_PREFIX || '10.XXXXX',
      apiUrl: process.env.CROSSREF_API_URL || 'https://api.crossref.org/v1/deposits',
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000',
      ...config,
    };

    // Create Basic Auth header
    this.authHeader = `Basic ${Buffer.from(
      `${this.config.username}:${this.config.password}`
    ).toString('base64')}`;
  }

  /**
   * Register a DOI with Crossref
   */
  async registerDoi(
    doi: string,
    metadata: CrossrefJournalArticleMetadata
  ): Promise<DoiRegistrationResult> {
    // Validate configuration
    if (!this.config.username || !this.config.password) {
      return {
        success: false,
        error: 'Crossref credentials not configured',
      };
    }

    if (!this.config.prefix || this.config.prefix === '10.XXXXX') {
      return {
        success: false,
        error: 'Crossref DOI prefix not configured',
      };
    }

    try {
      const depositBody = this.buildDepositRequest(metadata);
      
      console.log(`[Crossref] Registering DOI: ${doi}`);
      console.log(`[Crossref] API URL: ${this.config.apiUrl}`);

      const response = await this.makeRequest(depositBody);

      if (response.success) {
        console.log(`[Crossref] DOI registered successfully: ${doi}`);
        return {
          success: true,
          doi,
          depositId: response.depositId,
          message: 'DOI registered successfully',
        };
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Crossref] Registration failed for ${doi}:`, errorMessage);
      
      return {
        success: false,
        doi,
        error: errorMessage,
      };
    }
  }

  /**
   * Build the deposit request body
   */
  private buildDepositRequest(metadata: CrossrefJournalArticleMetadata): object {
    return {
      'owner-prefix': this.config.prefix,
      items: [metadata],
    };
  }

  /**
   * Make HTTP request to Crossref API with retry logic
   */
  private async makeRequest(
    body: object,
    retries = 3,
    retryDelay = 2000
  ): Promise<DoiRegistrationResult> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(this.config.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': this.authHeader,
            'Content-Type': 'application/json',
            'User-Agent': 'PrimeScientificPublishing/1.0 (mailto:support@primesp.com)',
          },
          body: JSON.stringify(body),
        });

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : retryDelay * attempt;
          console.warn(`[Crossref] Rate limited, waiting ${waitTime}ms before retry`);
          await this.sleep(waitTime);
          continue;
        }

        // Handle authentication errors
        if (response.status === 401) {
          return {
            success: false,
            error: 'Crossref authentication failed. Check username and password.',
          };
        }

        // Handle forbidden
        if (response.status === 403) {
          return {
            success: false,
            error: 'Crossref access forbidden. Check DOI prefix ownership.',
          };
        }

        // Handle server errors with retry
        if (response.status >= 500) {
          console.warn(`[Crossref] Server error ${response.status}, attempt ${attempt}/${retries}`);
          if (attempt < retries) {
            await this.sleep(retryDelay * attempt);
            continue;
          }
          return {
            success: false,
            error: `Crossref server error: ${response.status}`,
          };
        }

        // Parse response
        const responseText = await response.text();
        let responseData: CrossrefDepositResponse;

        try {
          responseData = JSON.parse(responseText);
        } catch {
          // Some Crossref responses are not JSON
          if (response.ok) {
            return {
              success: true,
              depositId: responseText.slice(0, 50), // Use part of response as ID
              message: 'DOI deposit accepted',
            };
          }
          return {
            success: false,
            error: `Invalid response: ${responseText.slice(0, 200)}`,
          };
        }

        // Check for success
        if (response.ok || responseData.status === 'ok') {
          return {
            success: true,
            depositId: responseData.message?.['batch-id'] || 
                       responseData.message?.['submission-id'] ||
                       'unknown',
            message: responseData.message?.status || 'Deposit accepted',
          };
        }

        // Handle error response
        return {
          success: false,
          error: JSON.stringify(responseData),
        };

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Network error';
        console.error(`[Crossref] Request failed (attempt ${attempt}/${retries}):`, errorMessage);

        if (attempt < retries) {
          await this.sleep(retryDelay * attempt);
          continue;
        }

        return {
          success: false,
          error: `Network error after ${retries} attempts: ${errorMessage}`,
        };
      }
    }

    return {
      success: false,
      error: 'Max retries exceeded',
    };
  }

  /**
   * Check DOI registration status (optional, for async deposits)
   */
  async checkDepositStatus(depositId: string): Promise<{ status: string; message?: string }> {
    try {
      const statusUrl = `${this.config.apiUrl}/${depositId}`;
      
      const response = await fetch(statusUrl, {
        headers: {
          'Authorization': this.authHeader,
          'User-Agent': 'PrimeScientificPublishing/1.0',
        },
      });

      if (!response.ok) {
        return { status: 'unknown', message: `HTTP ${response.status}` };
      }

      const data = await response.json();
      return {
        status: data.status || 'unknown',
        message: data.message,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test connection to Crossref API
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      // Simple test - try to access the API
      const response = await fetch('https://api.crossref.org/works?rows=1', {
        headers: {
          'User-Agent': 'PrimeScientificPublishing/1.0',
        },
      });

      if (response.ok) {
        return { success: true, message: 'Crossref API is reachable' };
      }

      return { success: false, message: `API returned ${response.status}` };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  /**
   * Sleep helper for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const crossrefClient = new CrossrefClient();
