# Cypress E2E Testing with TypeScript

A comprehensive end-to-end testing framework using Cypress with TypeScript support for robust and maintainable test automation. This project includes both UI and API testing capabilities with Cucumber BDD integration and Cypress Cloud CI/CD pipeline.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Pages Covered by Tests](#pages-covered-by-tests)
- [API Testing](#api-testing)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [CI/CD Integration with Cypress Cloud](#cicd-integration-with-cypress-cloud)
- [Custom Commands](#custom-commands)
- [Page Object Model](#page-object-model)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- TypeScript knowledge
- Basic understanding of Cypress
- Cypress Cloud account (for CI/CD integration)

## Installation

### 1. Install Dependencies

```bash
# Install Cypress and TypeScript dependencies
npm install --save-dev cypress typescript @cypress/webpack-preprocessor

# Install Cucumber dependencies
npm i @badeball/cypress-cucumber-preprocessor
npm i @bahmutov/cypress-esbuild-preprocessor

# Install linter and config
npm install --save-dev eslint @eslint/js typescript typescript-eslint
npm i eslint-config-airbnb-typescript

# Install cypress plugins
npm install --save-dev @4tw/cypress-drag-drop

# Install additional libraries
npm install --save-dev @faker-js/faker
npm install --save-dev @percy/cli @percy/cypress
npm install status-code-enum
npm install http-method-enum
```

### 2. Initialize Cypress

```bash
npx cypress open
```

## Project Structure

```
cypress/
├── e2e/                    # Test files
│   ├── ui/
│   │   └── pages/          # Page Object Models
│   └── api/                # API methods to work with endpoints
├── features/               # BDD Scenarios
├── fixtures/               # Test data
├── support/                # Custom commands and utilities
│   ├── commands.ts
│   ├── e2e.ts
│   └── step_definitions/   # Cucumber step definitions
├── downloads/              # Downloaded files during tests
└── screenshots/            # Screenshots of failed tests
```

## Configuration

### Cypress Configuration (`cypress.config.ts`)

The project is configured with Cypress Cloud integration using project ID `"ey3v8c"` and includes comprehensive environment variables for both UI and API testing endpoints.

```typescript
import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
projectId: "ey3v8c", // Cypress Cloud Project ID

  env: {
    // UI Endpoints
    login_url: "/login",
    shadow_dom_url: "/shadowdom",
    registration_url: "/register",
    form_validation_url: "/form-validation",
    form_confirmation_url: "/form-confirmation",
    file_upload_url: "/upload",
    drag_and_drop_url: "/drag-and-drop",
    dialogs_url: "/js-dialogs",
    dashboard_url: "/secure",
    cart_url: "/cart",
    checkout_url: "/checkout",
    profile_url: "/user/profile",
    signIn_url: "/user/signin",
    signUp_url: "/user/signup",
    bookstore_url: "/bookstore",
    
    // API Endpoints
    apiBaseUrl: "/notes/api",
    health_check_url: "/health-check",
    register_user_url: "/users/register",
    login_user_url: "/users/login",
    logout_user_url: "/users/logout",
    profile_user_url: "/users/profile",
    change_password_user_url: "/users/change-password",
    delete_account_user_url: "/users/delete-account",
    notes_url: "/notes",
  },
  
  e2e: {
    baseUrl: "https://practice.expandtesting.com",
    specPattern: "**/*.feature",
    experimentalRunAllSpecs: false,
    video: false,
    screenshotOnRunFailure: true,
    testIsolation: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    chromeWebSecurity: false,
    includeShadowDom: true,
    // ... rest of configuration
  },
});
```

## Pages Covered by Tests

### Authentication & User Management
- **Login Page** (`/login`): User authentication, form validation, credential validation, session management
- **Registration Page** (`/register`): User signup, password validation, email verification, form validation
- **User Dashboard** (`/secure`): Protected area access, user session validation, logout functionality
- **User Profile** (`/user/profile`): Profile information display and management
- **User Sign In/Up** (`/user/signin`, `/user/signup`): Alternative authentication flows

### Form Testing & Validation
- **Form Validation Page** (`/form-validation`): Input validation, error handling, form submission
- **Form Confirmation Page** (`/form-confirmation`): Success states, confirmation messages
- **File Upload** (`/upload`): File upload functionality, file type validation, size restrictions
- **Drag and Drop** (`/drag-and-drop`): Interactive drag-and-drop operations, element positioning

### Interactive Elements & UI Components  
- **Shadow DOM** (`/shadowdom`): Shadow DOM element interaction and testing
- **JavaScript Dialogs** (`/js-dialogs`): Alert handling, confirm dialogs, prompt interactions
- **Shopping Cart** (`/cart`): Add/remove items, quantity updates, cart persistence
- **Checkout Process** (`/checkout`): Payment flow simulation, order processing
- **Bookstore** (`/bookstore`): Catalog browsing, book selection, search functionality

### API Health & Status
- **Health Check** (`/health-check`): API availability, service status validation

## API Testing

This project includes comprehensive API testing capabilities using a structured approach with base classes and specific API implementations.

### API Architecture

#### BaseAPI Class
The `BaseAPI` class provides common functionality for all API interactions:

```typescript
export class BaseAPI {
  baseUrl: string;
  
  constructor() {
    this.baseUrl = `${Cypress.config().baseUrl}${Cypress.env("apiBaseUrl")}`;
  }
  
  // Generic request method with error handling
  request(options: {
    method?: HTTPMethod;
    url: string;
    failOnStatusCode?: boolean;
    headers?: Record<string, string>;
    body?: any;
  }): Cypress.Chainable<Cypress.Response<any>>
  
  // Authentication headers
  getAuthHeaders(token: string): Record<string, string>
  
  // Response validation methods
  validateResponseStatusCode(response, expectedStatus)
  validateStandardResponse(response, expectedStatus)
  
  // Health check functionality
  waitForAPIReady(): Cypress.Chainable<Cypress.Response<void>>
}
```

#### AuthAPI Class
Specialized API class for authentication operations:

```typescript
export class AuthAPI extends BaseAPI {
  // User registration
  register(userData): Cypress.Chainable<Cypress.Response<ApiResponse<any>>>
  
  // User login
  login(credentials): Cypress.Chainable<Cypress.Response<ApiResponse<{token: string; user: User}>>>
  
  // User logout
  logout(token: string): Cypress.Chainable<Cypress.Response<void>>
  
  // Get user profile
  getProfile(token: string): Cypress.Chainable<Cypress.Response<ApiResponse<{user: User}>>>
  
  // Change password
  changePassword(token: string, passwordData): Cypress.Chainable<Cypress.Response<ApiResponse<any>>>
  
  // Delete account
  deleteAccount(token: string): Cypress.Chainable<Cypress.Response<void>>
  
  // Utility methods
  registerAndLogin(userData): Cypress.Chainable<string>
  validateUserStructure(user)
  validateAuthResponse(response, expectedStatus)
  validateRegistrationResponse(response, expectedStatus)
}
```

### API Test Coverage

#### Authentication Endpoints
- **POST** `/users/register` - User registration with validation
- **POST** `/users/login` - User authentication and token generation
- **DELETE** `/users/logout` - Session termination
- **GET** `/users/profile` - User profile retrieval
- **POST** `/users/change-password` - Password updates
- **DELETE** `/users/delete-account` - Account deletion

#### Notes Management API
- **GET** `/notes` - Retrieve user notes
- **POST** `/notes` - Create new notes
- **PUT** `/notes/:id` - Update existing notes
- **DELETE** `/notes/:id` - Delete notes

#### Health & Status
- **GET** `/health-check` - API health verification

### API Testing Features

#### Response Validation
- Status code verification
- Response structure validation  
- Data type and format checks
- Error message validation
- Authentication token validation

#### Error Handling
- Invalid credentials testing
- Missing required fields
- Invalid data formats
- Authentication failures
- Authorization checks

#### Data Integrity
- User data structure validation
- Email format verification
- Password requirements
- Token expiration handling

### Usage Example

```typescript
import { authAPI } from '../support/api/AuthAPI';

// Register and login flow
authAPI.register(userData).then((response) => {
  authAPI.validateRegistrationResponse(response, 201);
  
  return authAPI.login({
    email: userData.email,
    password: userData.password
  });
}).then((loginResponse) => {
  authAPI.validateAuthResponse(loginResponse, 200);
  const token = loginResponse.body.data.token;
  
  // Use token for subsequent authenticated requests
  return authAPI.getProfile(token);
});
```

## Writing Tests

### Basic Test Structure

Create feature files using Gherkin syntax:

```gherkin
Feature: User Authentication API

  Scenario: Successful user registration
    Given I have valid user registration data
    When I send a POST request to register endpoint
    Then the response status should be 201
    And the response should contain user data
    And the user should be successfully created

  Scenario: Successful user login
    Given I have a registered user
    When I send a POST request to login endpoint with valid credentials
    Then the response status should be 200
    And the response should contain authentication token
    And the response should contain user data

  Scenario: User profile retrieval
    Given I am authenticated with a valid token
    When I send a GET request to profile endpoint
    Then the response status should be 200
    And the response should contain user profile data
```

Create step definitions under `/support/step_definitions` directory:

```typescript
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { authAPI } from "../../e2e/api/AuthAPI";

let userData: any;
let authToken: string;
let apiResponse: Cypress.Response<any>;

Given("I have valid user registration data", () => {
  userData = {
    name: "Test User",
    email: `test${Date.now()}@example.com`,
    password: "TestPassword123!"
  };
});

When("I send a POST request to register endpoint", () => {
  authAPI.register(userData).then((response) => {
    apiResponse = response;
  });
});

Then("the response status should be {int}", (expectedStatus: number) => {
  authAPI.validateResponseStatusCode(apiResponse, expectedStatus);
});

Then("the response should contain user data", () => {
  expect(apiResponse.body.data).to.have.property('id');
  expect(apiResponse.body.data).to.have.property('name', userData.name);
  expect(apiResponse.body.data).to.have.property('email', userData.email);
});
```

## Running Tests

### Development Mode

```bash
# Open Cypress Test Runner
npm run cy:open

# Run tests headlessly
npm run cy:run

# Run tests headlessly with Percy
percy exec -- cypress run

# Run specific test file
npm run cy:run --spec "cypress/features/login.feature"

# Run tests in specific browser
npm run cy:run:chrome

# Run tests with mobile viewport
npm run cy:test:mobile
```

### Package.json Scripts

```json
{
  "scripts": {
    "clean-install": "rm -rf node_modules && npm install",
    "cy:open": "npx cypress open",
    "cy:run": "npx cypress run",
    "cy:run:chrome": "npx cypress run --browser chrome",
    "cy:run:firefox": "npx cypress run --browser firefox",
    "cy:test": "npx cypress run --spec 'cypress/features/*.feature'",
    "cy:test:mobile": "npx cypress run --config viewportWidth=375,viewportHeight=667",
    "cy:test:api": "npx cypress run --spec 'cypress/features/api/*.feature'",
    "cy:test:ui": "npx cypress run --spec 'cypress/features/ui/*.feature'"
  }
}
```

## CI/CD Integration with Cypress Cloud

This project uses GitHub Actions with Cypress Cloud for automated testing and parallel execution.

### Cypress Cloud Configuration

The project is configured with Cypress Cloud using project ID: `ey3v8c`

### GitHub Actions Workflow

The CI/CD pipeline (`cypress-tests.yaml`) provides:

#### Parallel Test Execution
- **3 parallel containers** for faster test execution
- **Manual test splitting** across containers
- **Chrome browser** testing with optimized settings

#### Workflow Triggers
```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
```

#### Key Features

**Parallel Strategy**:
```yaml
strategy:
  fail-fast: false
  matrix:
    containers: [1, 2, 3] # 3 parallel containers
```

**Dynamic Test Splitting**:
- Automatically discovers `.feature` files
- Distributes tests evenly across containers
- Handles variable test file counts

**Browser Configuration**:
- Chrome browser with security optimizations
- Full-screen mode for consistent screenshots
- GPU acceleration settings for performance

**Artifact Management**:
- Test results, screenshots, and videos collection
- Combined results aggregation
- GitHub Pages deployment for reports

#### Workflow Steps

1. **Environment Setup**
   - Node.js 24 installation
   - npm dependency caching
   - Dependency installation

2. **Test Discovery & Splitting**
   - Automatic feature file discovery
   - Manual distribution across containers
   - Container-specific test assignment

3. **Test Execution**
   - Parallel test running per container
   - Chrome browser with optimized settings
   - Failure tolerance with `continue-on-error`

4. **Results Collection**
   - Individual container artifact upload
   - Combined results processing
   - GitHub Pages deployment

#### Environment Variables

Set the following secrets in your GitHub repository:

```bash
# Required for Cypress Cloud (if using record mode)
CYPRESS_RECORD_KEY=your_cypress_cloud_record_key

# GitHub token for Pages deployment
GITHUB_TOKEN=automatically_provided
```

#### Running Tests in Cypress Cloud

To enable Cypress Cloud recording, update your test commands:

```bash
# Record tests to Cypress Cloud
npx cypress run --record --key $CYPRESS_RECORD_KEY

# Record with parallel execution
npx cypress run --record --key $CYPRESS_RECORD_KEY --parallel

# Record with specific browser
npx cypress run --record --key $CYPRESS_RECORD_KEY --browser chrome
```

#### Cloud Benefits

- **Test Analytics**: Detailed insights and trends
- **Parallel Execution**: Faster test runs across multiple containers
- **Test Results**: Centralized test result management
- **Screenshots & Videos**: Automatic failure artifact collection
- **Integration**: Seamless GitHub integration with status checks

### Local Development with Cloud Integration

```bash
# Run tests with cloud recording
npx cypress run --record

# Open Cypress with cloud connection
npx cypress open --record
```

## Page Object Model

### Base Page Class

```typescript
// cypress/e2e/ui/pages/BasePage.ts
export abstract class BasePage {
  private readonly baseSelectors = {
    coreContainer: "#core",
    usernameInput: "#username",
    passwordInput: "#password",
    flashAlert: "#flash",
    flashCloseButton: "#flash > button",
  } as const;

  protected elements = {
    baseContainer: () => cy.get(`${this.baseSelectors.coreContainer}`),
    username: () => cy.get(`${this.baseSelectors.usernameInput}`),
    password: () => cy.get(`${this.baseSelectors.passwordInput}`),
    alert: () => cy.get(`${this.baseSelectors.flashAlert}`),
    alertCloseButton: () => cy.get(`${this.baseSelectors.flashCloseButton}`),
  };

  abstract verifyPageLoaded(): void;

  fillUsername(value: string) {
    this.elements.username().clear().type(value);
    return this;
  }

  fillPassword(value: string) {
    this.elements.password().clear().type(value);
    return this;
  }

  getAlert() {
    return this.elements.alert();
  }

  closeAlert() {
    this.elements.alertCloseButton().click();
  }
}
```

### Login Page Example

```typescript
// /e2e/ui/pages/LoginPage.ts
import { BasePage } from "./BasePage";
import { Singleton } from "../../../support/utilities/Decorators";

@Singleton
class LoginPage extends BasePage {
  private readonly loginSelectors = {
    coreContainer: "#core",
    listItems: "ul > li",
    loginForm: "#login",
    submitButton: "button",
  } as const;

  protected loginElements = {
    coreContainer: () => cy.get(`${this.loginSelectors.coreContainer}`),
    credentialsListItems: () =>
      cy
        .get(`${this.loginSelectors.coreContainer}`)
        .find(`${this.loginSelectors.listItems}`),
    usernameListItem: () =>
      cy
        .get(`${this.loginSelectors.coreContainer}`)
        .find(`${this.loginSelectors.listItems}`)
        .contains("Username:"),
    passwordListItem: () =>
      cy
        .get(`${this.loginSelectors.coreContainer}`)
        .find(`${this.loginSelectors.listItems}`)
        .contains("Password:"),
    submitButton: () =>
      cy
        .get(`${this.loginSelectors.loginForm}`)
        .find(`${this.loginSelectors.submitButton}`),
  };

  #username: string;
  #password: string;

  constructor(username: string, password: string) {
    super();
    this.#username = username;
    this.#password = password;
  }

  getUsername(): string {
    return this.#username === ""
      ? this.#setValidUsernameFromPage()
      : this.#username;
  }

  getPassword() {
    return this.#password === ""
      ? this.#setValidPasswordFromPage()
      : this.#password;
  }

  visit() {
    cy.visit("/login");
    this.#setValidUsernameFromPage();
    this.#setValidPasswordFromPage();
  }

  submit() {
    this.loginElements.submitButton().click();
  }

  verifyPageLoaded() {
    this.verifyPageUrl();
    this.elements
      .baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot("Login Page", { scope: selector });
      });
  }
  
  // Private methods...
}

export const loginPage = new LoginPage("", "");
```

## Custom Commands

### TypeScript Support

Create `cypress/support/e2e.ts`:

```typescript
import "./commands";

declare global {
  namespace Cypress {
    interface Chainable {
      shouldExistAndBeVisible(selector: string): Chainable<JQuery<HTMLElement>>;
      apiLogin(email: string, password: string): Chainable<string>;
      apiRegisterUser(userData: any): Chainable<Cypress.Response<any>>;
    }
  }
}

// UI Commands
Cypress.Commands.add("shouldExistAndBeVisible", (selector: string) => {
  return cy.get(selector).should("exist").and("be.visible");
});

// API Commands
Cypress.Commands.add("apiLogin", (email: string, password: string) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.config().baseUrl}${Cypress.env("apiBaseUrl")}${Cypress.env("login_user_url")}`,
    body: { email, password }
  }).then((response) => {
    return response.body.data.token;
  });
});

Cypress.Commands.add("apiRegisterUser", (userData: any) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.config().baseUrl}${Cypress.env("apiBaseUrl")}${Cypress.env("register_user_url")}`,
    body: userData
  });
});
```

## Best Practices

### 1. Test Organization

- **Separate UI and API tests** into different feature files
- **Use descriptive scenario names** that explain the business value
- **Group related tests** by functionality or user journey
- **Keep tests independent** and atomic
- **Use Background steps** for common setup

### 2. API Testing Best Practices

- **Validate response structure** not just status codes
- **Test error scenarios** alongside happy paths  
- **Use proper HTTP methods** and status codes
- **Test data integrity** and business logic
- **Implement proper cleanup** after tests

### 3. Selectors & Page Objects

- **Prefer data-testid attributes** over class names or IDs
- **Use semantic selectors** when possible
- **Implement page object pattern** for maintainability
- **Encapsulate element interactions** in page methods

### 4. CI/CD & Cloud Integration

- **Use parallel execution** to reduce test run time
- **Record test results** to Cypress Cloud for analytics
- **Implement proper artifact collection** for debugging
- **Set appropriate timeouts** for CI environment

### 5. Performance & Reliability

- **Use cy.session()** for authentication state
- **Minimize UI interactions** in favor of API calls for setup
- **Use cy.intercept()** for stubbing external dependencies
- **Implement proper waits** and retry logic

## Troubleshooting

### Common Issues

1. **TypeScript compilation errors**
   - Ensure tsconfig.json is properly configured
   - Check that all dependencies are installed
   - Verify import paths are correct

2. **API request failures**
   - Check base URL configuration
   - Verify authentication tokens are valid
   - Ensure API endpoints are accessible

3. **Parallel execution issues**
   - Verify test independence
   - Check for shared state problems
   - Ensure proper test isolation

4. **Cypress Cloud integration**
   - Verify project ID is correct
   - Check record key configuration
   - Ensure proper network access

### Debug Tips

```typescript
// Add debug information for API responses
cy.request(options).then((response) => {
  cy.log('API Response:', JSON.stringify(response.body));
});

// Pause test execution
cy.pause();

// Take screenshot for debugging
cy.screenshot("debug-state");

// Log test data
cy.log("Test data:", JSON.stringify(testData));
```

### API Debugging

```typescript
// Log request details
cy.request(options).then((response) => {
  cy.log(`Request: ${options.method} ${options.url}`);
  cy.log(`Status: ${response.status}`);
  cy.log(`Body:`, response.body);
});

// Validate response step by step
authAPI.login(credentials).then((response) => {
  cy.log('Login response received');
  expect(response.status).to.equal(200);
  cy.log('Status validated');
  expect(response.body).to.have.property('data');
  cy.log('Data property exists');
  // Continue validation...
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests following the established patterns
4. Ensure all tests pass locally and in CI
5. Update documentation as needed
6. Submit a pull request

### Code Style

- Use TypeScript strict mode
- Follow consistent naming conventions
- Add JSDoc comments for custom commands
- Use meaningful variable and function names
- Implement proper error handling
- Write maintainable and readable code