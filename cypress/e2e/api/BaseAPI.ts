import { HTTPMethod } from 'http-method-enum';
import { StatusCode } from 'status-code-enum';

export class BaseAPI {
  
  baseUrl: string;

  constructor() {
    this.baseUrl = `${Cypress.config().baseUrl}${Cypress.env('apiBaseUrl')}`;
  }

  /**
   * Make a generic API request with standard error handling
   * @param {Object} options - Request options
   * @returns {Cypress.Chainable} - Cypress response
   */
  request(options: {
    method?: HTTPMethod;
    url: string;
    failOnStatusCode?: boolean;
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
    qs?: Record<string, any>;
  }): Cypress.Chainable {
    const defaultOptions = {
      method: HTTPMethod.GET,
      failOnStatusCode: false,
      timeout: Cypress.env('defaultTimeout') || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const requestOptions = {
      ...defaultOptions,
      ...options,
      url: `${this.baseUrl}${options.url}`
    };

    return cy.request(requestOptions).then((response) => {
      if (response.status >= StatusCode.ClientErrorBadRequest && requestOptions.failOnStatusCode === true) {
        cy.log(`API request failed with status: ${response.status}`);
        throw new Error(`API request to ${requestOptions.url} failed with status code ${response.status}`);
      }
      return response;
    });
  }

  /**
   * Add authentication header to request options
   * @param {string} token - Auth token
   * @returns {Object} - Headers object
   */
  getAuthHeaders(token: string): Record<string, string> {
    return {
      'X-Auth-Token': token
    };
  }

  /**
   * Validate standard API response structure
   * @param {Object} response - API response
   * @param {number} expectedStatus - Expected HTTP status
   */
  validateResponse(response: Cypress.Response<any> | JQuery<HTMLElement>, expectedStatus = StatusCode.SuccessOK): void {
    const actualResponse = (response as any).jquery ? (response as any)[0] : response;
    expect(actualResponse).to.have.property('status', expectedStatus);
    expect(actualResponse).to.have.property('body');
    expect(actualResponse.body).to.have.property('success');
    
    if (expectedStatus >= StatusCode.SuccessOK && expectedStatus < StatusCode.RedirectMultipleChoices) {
      expect(actualResponse.body.success).to.be.true;
      if (actualResponse.body.data) {
        expect(actualResponse.body).to.have.property('data');
      }
    } else {
      expect(actualResponse.body.success).to.be.false;
      expect(actualResponse.body).to.have.property('message');
    }
  }

  /**
   * Wait for API to be ready
   * @returns {Cypress.Chainable} - Health check response
   */
  waitForAPIReady(): Cypress.Chainable {
    return this.request({
      method: HTTPMethod.GET,
      url: Cypress.env('health_check_url'),
      failOnStatusCode: false
    }).then((response) => {
      
      if (response.status !== StatusCode.SuccessOK) {
        cy.log('API health check failed, but continuing...');
      } 
      return response;
    });
  }
}