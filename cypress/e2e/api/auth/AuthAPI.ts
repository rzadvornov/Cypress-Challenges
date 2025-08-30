import { BaseAPI } from "../BaseAPI";
import { HTTPMethod } from "http-method-enum";
import { StatusCode } from "status-code-enum";
import { User } from "../support/user";

export class AuthAPI extends BaseAPI {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Cypress.Chainable} - Registration response
   */
  register(userData: any) {
    return this.request({
      method: HTTPMethod.POST,
      url: `${Cypress.env("register_user_url")}`,
      body: userData
    });
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Cypress.Chainable} - Login response
   */
  login(credentials: { email: string; password: string }) {
    return this.request({
      method: HTTPMethod.POST,
      url: `${Cypress.env("login_user_url")}`,
      body: credentials,
    });
  }

  /**
   * Logout user
   * @param {string} token - Auth token
   * @returns {Cypress.Chainable} - Logout response
   */
  logout(token: string) {
    return this.request({
      method: HTTPMethod.DELETE,
      url: `${Cypress.env("logout_user_url")}`,
      headers: this.getAuthHeaders(token),
    });
  }

  /**
   * Get user profile
   * @param {string} token - Auth token
   * @returns {Cypress.Chainable} - Profile response
   */
  getProfile(token: string) {
    return this.request({
      method: HTTPMethod.GET,
      url: `${Cypress.env("profile_user_url")}`,
      headers: this.getAuthHeaders(token),
    });
  }

  /**
   * Change password
   * @param {string} token - Auth token
   * @param {Object} passwordData - Password change data
   * @returns {Cypress.Chainable} - Password change response
   */
  changePassword(token: string, passwordData: any) {
    return this.request({
      method: HTTPMethod.POST,
      url: `${Cypress.env("change_password_user_url")}`,
      body: passwordData,
      headers: this.getAuthHeaders(token),
    });
  }

  /**
   * Delete user account
   * @param {string} token - Auth token
   * @returns {Cypress.Chainable} - Delete response
   */
  deleteAccount(token: string) {
    return this.request({
      method: HTTPMethod.DELETE,
      url: `${Cypress.env("delete_account_user_url")}`,
      headers: this.getAuthHeaders(token),
    });
  }

  /**
   * Register and login user in one step
   * @param {Object} userData - User data
   * @returns {Cypress.Chainable} - Login response with token
   */
  registerAndLogin(userData: { email: string; password: string }) {
    return this.register(userData).then(() => {
      return this.login({
          email: userData.email,
          password: userData.password,
        }).then((loginResponse) => {
          return loginResponse.body.data.token;
        });
    });
  }

  /**
   * Validate user data structure
   * @param {Object} user - User object
   */
  validateUserStructure(user: { id: string; name: string; email: string }) {
    this.validateUserData(user);
  }

  /**
   * Validate registration data structure
   * @param {Object} data - Data object
   */
  validateDataStructure(data: { id: string; name: string; email: string }) {
    this.validateUserData(data);
  }

  /**
   * Validate user data structure
   */
  validateUserData(data: Partial<User>) {
    const requiredProperties = ["id", "name", "email"] as const;

    requiredProperties.forEach((prop) => {
      expect(data).to.have.property(prop);
      expect(data[prop]).to.be.a("string").and.not.be.empty;
    });

    expect(data.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  /**
   * Validate authentication response
   * @param {Object} response - Auth response
   * @param {number} expectedStatus - Expected status code
   */
  validateAuthResponse(
    response: Cypress.Response<any> | JQuery<HTMLElement>,
    expectedStatus = StatusCode.SuccessOK
  ) {
    const actualResponse = (response as any).jquery
      ? (response as any)[0]
      : response;
    this.validateResponse(actualResponse, expectedStatus);

    if (
      expectedStatus === StatusCode.SuccessOK ||
      expectedStatus === StatusCode.SuccessCreated
    ) {
      expect(actualResponse.body.data).to.have.property("token");
      expect(actualResponse.body.data.token).to.be.a("string").and.not.be.empty;
      expect(actualResponse.body.data).to.have.property("user");
      this.validateUserStructure(actualResponse.body.data.user);
    }
  }

  /**
   * Validate registration response
   * @param {Object} response - Auth response
   * @param {number} expectedStatus - Expected status code
   */
  validateRegistrationResponse(
    response: Cypress.Response<any> | JQuery<HTMLElement>,
    expectedStatus = StatusCode.SuccessOK
  ) {
    const actualResponse = (response as any).jquery
      ? (response as any)[0]
      : response;
    this.validateResponse(actualResponse, expectedStatus);

    if (
      expectedStatus === StatusCode.SuccessOK ||
      expectedStatus === StatusCode.SuccessCreated
    ) {
      expect(actualResponse.body).to.have.property("message");
      this.validateDataStructure(actualResponse.body.data);
    }
  }
}

export const authAPI = new AuthAPI();
