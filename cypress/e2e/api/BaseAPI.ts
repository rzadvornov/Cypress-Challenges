import { HTTPMethod } from "http-method-enum";
import { StatusCode } from "status-code-enum";
import { ApiResponse } from "./notes/types/apiResponse";

export class BaseAPI {
  baseUrl: string;

  constructor() {
    this.baseUrl = `${Cypress.config().baseUrl}${Cypress.env("apiBaseUrl")}`;
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
  }): Cypress.Chainable<Cypress.Response<any>> {
    const defaultOptions = {
      method: HTTPMethod.GET,
      failOnStatusCode: false,
      timeout: Cypress.env("defaultTimeout") || 10000,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const requestOptions = {
      ...defaultOptions,
      ...options,
      url: `${this.baseUrl}${options.url}`,
    };

    return cy.request(requestOptions).then((response) => {
      if (
        response.status >= StatusCode.ClientErrorBadRequest &&
        requestOptions.failOnStatusCode === true
      ) {
        cy.log(`API request failed with status: ${response.status}`);
        throw new Error(
          `API request to ${requestOptions.url} failed with status code ${response.status}`
        );
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
      "X-Auth-Token": token,
    };
  }

  /**
   * Normalizes a response that could be either a Cypress Response or a jQuery element
   * @param response - The response to normalize, either Cypress.Response or JQuery<HTMLElement>
   * @returns The actual response object, extracting from jQuery wrapper if necessary
   */
  public normalizeResponse(
    response: Cypress.Response<any> | JQuery<HTMLElement>
  ): Cypress.Response<any> {
    const actualResponse = (response as any).jquery
      ? (response as any)[0]
      : response;

    return actualResponse;
  }

  /**
   * Validate standard API response status code
   * @param {Object} response - API response
   * @param {number} expectedStatus - Expected HTTP status
   */
  validateResponseStatusCode(
    response: Cypress.Response<any> | JQuery<HTMLElement>,
    expectedStatus: number
  ): void {
    const actualResponse = this.normalizeResponse(response);
    expect(actualResponse.status).to.equal(expectedStatus);
  }

  /**
   * Validate standard API response structure
   * @param {Object} response - API response
   * @param {number} expectedStatus - Expected HTTP status
   */
  validateStandardResponse(
    response: Cypress.Response<ApiResponse<any>> | JQuery<HTMLElement>,
    expectedStatus = StatusCode.SuccessOK
  ): void {
    const actualResponse = this.normalizeResponse(response);
    expect(actualResponse).to.have.property("status", expectedStatus);
    expect(actualResponse).to.have.property("body");
    expect(actualResponse.body).to.have.property("success");

    if (
      expectedStatus >= StatusCode.SuccessOK &&
      expectedStatus < StatusCode.RedirectMultipleChoices
    ) {
      expect(actualResponse.body.success).to.be.true;
      if (actualResponse.body.data) {
        expect(actualResponse.body).to.have.property("data");
      }
    } else {
      expect(actualResponse.body.success).to.be.false;
      expect(actualResponse.body).to.have.property("message");
    }
  }

  /**
   * Wait for API to be ready
   * @returns {Cypress.Chainable} - Health check response
   */
  waitForAPIReady(): Cypress.Chainable<Cypress.Response<void>> {
    return this.request({
      method: HTTPMethod.GET,
      url: Cypress.env("health_check_url"),
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status !== StatusCode.SuccessOK) {
        cy.log("API health check failed, but continuing...");
      }
      return response;
    });
  }
}
