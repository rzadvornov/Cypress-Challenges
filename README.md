# Cypress E2E Testing with TypeScript

A comprehensive end-to-end testing framework using Cypress with TypeScript support for robust and maintainable test automation.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Custom Commands](#custom-commands)
- [Page Object Model](#page-object-model)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- TypeScript knowledge
- Basic understanding of Cypress

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
│   │   └── /pages # Page Object Models
|   |---api/ # API methods to work with endpoints
├── features/               # BDD Scenarios
├── fixtures/               # Test data
├── support/                # Custom commands and utilities
│   ├── commands.ts
│   ├── e2e.ts
│   └── step_definitions/   #
└── downloads/              # Downloaded files during tests
└── screenshots/            # Screenshots of failed tests
```

### Cypress Configuration (`cypress.config.ts`)

```typescript
import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  e2e: {
    baseUrl: "https://practice.expandtesting.com",
    specPattern: "**/*.feature",
    experimentalRunAllSpecs: true,
    async setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ): Promise<Cypress.PluginConfigOptions> {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // Browser launch configuration
      on(
        "before:browser:launch",
        (
          browser = {
            name: "",
            family: "chromium",
            channel: "",
            displayName: "",
            version: "",
            majorVersion: "",
            path: "",
            isHeaded: false,
            isHeadless: false,
          },
          launchOptions
        ) => {
          if (browser.family === "chromium" && browser.name !== "electron") {
            launchOptions.args.push("--start-fullscreen");
            launchOptions.args.push("--guest");
            return launchOptions;
          }
          if (browser.name === "electron") {
            launchOptions.preferences.fullscreen = true;
            return launchOptions;
          }
        }
      );
      return config;
    },
  },
});
```

### TypeScript Support

Create `cypress/support/e2e.ts`:

```typescript
Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});
```

```typescript
import "./commands";

// Import Cypress commands
declare global {
  namespace Cypress {
    interface Chainable {
      shouldExistAndBeVisible(selector: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add("shouldExistAndBeVisible", (selector: string) => {
  return cy.get(selector).should("exist").and("be.visible");
});
```

## Writing Tests

### Basic Test Structure

# Create a feature file using gherkin syntax

```gherkin
  Scenario: Successful login with valid username and password
    Given the user enters valid username
    And the user enters valid password
    When the user clicks the 'Login' button
    Then the user should be redirected to the dashboard page
    And the user should see greeting message
    And the user should see a 'You logged into a secure area!' alert message
    And the user session should be established
    When the user clicks Logout button
    Then the user session should be disconnected
    And the user should be redirected to Login page
```

# Create step definitions under /support/step_definitions directory

```typescript
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../e2e/elements/pages/LoginPage";

const verifyLoginPage = () => {
  loginPage.verifyPageLoaded();
};

Given("the user is on the Login page", () => {
  loginPage.visit();
});

Given("the login form is displayed", verifyLoginPage);

Given("the user enters valid username", () => {
  loginPage.fillUsername(loginPage.getUsername());
});

Given("the user enters valid password", () => {
  loginPage.fillPassword(loginPage.getPassword());
});

Given("the user enters username {string}", (username) => {
  loginPage.fillUsername(username);
});

Given("the user enters password {string}", (password) => {
  loginPage.fillPassword(password);
});

When("the user clicks the 'Login' button", () => {
  loginPage.submit();
});

Then("the user should be redirected to Login page", verifyLoginPage);

Then("the user should remain on the Login page", verifyLoginPage);

Then(
  "an error message {string} should be displayed",
  function (alertMessage: string) {
    const alert = loginPage.getAlert();
    alert.should("have.css", "background-color", "rgb(248, 215, 218)");
    alert.contains(alertMessage);
  }
);

Then("the username field should be cleared", () => {
  loginPage.verifyEmptyUsername();
});

Then("the password field should be cleared", () => {
  loginPage.verifyEmptyPassword();
});
```

## Running Tests

### Development Mode

```bash
# Open Cypress Test Runner
# Run tests headlessly with Percy
npm run cy:open

# Run tests headlessly with Percy
percy exec -- cypress run

# Run specific test file with Percy
percy exec -- cypress run --spec "cypress/e2e/features/Login.feature"

# Run tests in specific browser with Percy
percy exec -- cypress run --browser chrome
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
    "cy:test": "npx cypress run --spec 'cypress/e2e/features/*.feature'",
    "cy:test:mobile": "npx cypress run --config viewportWidth=375,viewportHeight=667"
  }
}
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

  #setValidUsernameFromPage() {
    this.loginElements
      .usernameListItem()
      .invoke("text")
      .then((text) => {
        this.#username = text
          .toString()
          .replace(/Username:/g, "")
          .trim();
      });
    return this.#username;
  }

  #setValidPasswordFromPage() {
    this.loginElements
      .passwordListItem()
      .invoke("text")
      .then((text) => {
        this.#password = text
          .toString()
          .replace(/Password:/g, "")
          .trim();
      });
    return this.#password;
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

  verifyPageUrl() {
    cy.url().should(
      "eq",
      `${Cypress.config().baseUrl}${Cypress.env("login_url")}`
    );
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

  verifyEmptyUsername() {
    this.elements.username().invoke("val").should("have.lengthOf", 0);
  }

  verifyEmptyPassword() {
    this.elements.password().invoke("val").should("have.lengthOf", 0);
  }
}

export const loginPage = new LoginPage("", "");
```

### Using Page Objects in Tests

```typescript
// cypress/e2e/support/step_definitions/login.ts
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../e2e/elements/pages/LoginPage";

const verifyLoginPage = () => {
  loginPage.verifyPageLoaded();
};

Given("the user is on the Login page", () => {
  loginPage.visit();
});

Given("the login form is displayed", verifyLoginPage);

Given("the user enters valid username", () => {
  loginPage.fillUsername(loginPage.getUsername());
});

Given("the user enters valid password", () => {
  loginPage.fillPassword(loginPage.getPassword());
});

Given("the user enters username {string}", (username) => {
  loginPage.fillUsername(username);
});

Given("the user enters password {string}", (password) => {
  loginPage.fillPassword(password);
});

When("the user clicks the 'Login' button", () => {
  loginPage.submit();
});

Then("the user should be redirected to Login page", verifyLoginPage);

Then("the user should remain on the Login page", verifyLoginPage);

Then(
  "an error message {string} should be displayed",
  function (alertMessage: string) {
    const alert = loginPage.getAlert();
    alert.should("have.css", "background-color", "rgb(248, 215, 218)");
    alert.contains(alertMessage);
  }
);

Then("the username field should be cleared", () => {
  loginPage.verifyEmptyUsername();
});

Then("the password field should be cleared", () => {
  loginPage.verifyEmptyPassword();
});
```

## Best Practices

### 1. Test Organization

- Group related tests in describe blocks
- Use descriptive test names
- Keep tests independent and atomic
- Use beforeEach/afterEach for setup/cleanup

### 2. Selectors

- Prefer data-testid attributes over class names or IDs
- Use semantic selectors when possible
- Avoid brittle selectors that change frequently

### 3. Assertions

- Use explicit assertions over implicit ones
- Chain assertions for better readability
- Use should() for retry-able assertions

### 4. Test Data

- Use fixtures for static test data
- Generate dynamic data when needed
- Clean up test data after tests

### 5. Performance

- Use cy.session() for authentication
- Minimize UI interactions in favor of API calls
- Use cy.intercept() for stubbing API calls

## Troubleshooting

### Common Issues

1. **TypeScript compilation errors**

   - Ensure tsconfig.json is properly configured
   - Check that all dependencies are installed

2. **Element not found errors**

   - Add proper waits using cy.wait() or should() assertions
   - Verify selectors are correct

3. **Test flakiness**
   - Use proper waits instead of hard-coded cy.wait()
   - Ensure tests are independent
   - Use cy.intercept() for API mocking

### Debug Tips

```typescript
// Add debug information
cy.debug();

// Pause test execution
cy.pause();

// Log values
cy.log("Custom message");

// Take screenshot
cy.screenshot("test-state");
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests following the established patterns
4. Ensure all tests pass
5. Submit a pull request

### Code Style

- Use TypeScript strict mode
- Follow consistent naming conventions
- Add JSDoc comments for custom commands
- Use meaningful variable and function names

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Cypress Tests

on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cypress-io/github-action@v5
        with:
          build: npm run build
          start: npm start
          wait-on: "http://localhost:3000"
```
