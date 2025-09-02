import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { authAPI } from "../../../../e2e/api/notes/AuthAPI";
import { testDataAPI } from "../../../../e2e/api/support/TestDataAPI";
import { StatusCode } from "status-code-enum";
import { GeneralUtils } from "../../../utilities/GeneralUtils";

let currentUser = {};
let currentToken = "";
let apiResponse = {};

const createUser = () => {
  testDataAPI.createUserAndGetToken().then((token) => {
    currentToken = token;
    expect(token).to.be.a("string").and.not.be.empty;
    cy.wrap(token).as("authToken");
  });
};

const extractTokenFromResponse = (response: any) => {
  const actualResponse = authAPI.normalizeResponse(response);
  currentToken = actualResponse.body.data.token;
  cy.wrap(currentToken).as("authToken");
};

Given("the Notes API is available", () => {
  authAPI.waitForAPIReady();
  expect(Cypress.env("notes_url")).to.exist;
  expect(Cypress.env("register_user_url")).to.exist;
  expect(Cypress.env("login_user_url")).to.exist;
  expect(Cypress.env("logout_user_url")).to.exist;
  expect(Cypress.env("profile_user_url")).to.exist;
  expect(Cypress.env("change_password_user_url")).to.exist;
  expect(Cypress.env("delete_account_user_url")).to.exist;
});

Given("a user has valid registration details", () => {
  currentUser = testDataAPI.generateUser();
  cy.wrap(currentUser).as("registrationData");
});

Given("a user has registration details with invalid email format", () => {
  currentUser = testDataAPI.getInvalidData().user.invalidEmail;
  cy.wrap(currentUser).as("registrationData");
});

Given("a user has a registered user account", createUser);

Given("a user is logged in with valid credentials", createUser);

Given("a user has invalid login credentials", () => {
  const loginData = {
    email: testDataAPI.getInvalidData().user.invalidCredentials.email,
    password: testDataAPI.getInvalidData().user.invalidCredentials.password,
  };
  cy.wrap(loginData).as("loginData");
});

Given("a user is logged in as a valid user", createUser);

When("a user registers a new user account", () => {
  cy.get("@registrationData").then((userData) => {
    authAPI.register(userData).then((response) => {
      apiResponse = response;
      cy.wrap(apiResponse).as("registrationResponse");
    });
  });
});

When("a user attempts to register a new user account", () => {
  authAPI.register(currentUser).then((response) => {
    apiResponse = response;
    cy.wrap(response).as("registrationResponse");
  });
});

When("a user logs in with valid credentials", () => {
  const user = testDataAPI.getCreatedUser();

  const loginData = {
    email: user.userData.email,
    password: user.userData.password,
  };

  authAPI.login(loginData).then((response) => {
    apiResponse = response;
    cy.wrap(response).as("loginResponse");
  });
});

When("a user attempts to login", () => {
  cy.get("@loginData").then((loginData) => {
    const actualLoginData = GeneralUtils.getWrappedData(loginData);
    authAPI.login(actualLoginData).then((response) => {
      apiResponse = response;
      cy.wrap(response).as("loginResponse");
    });
  });
});

When("a user logs out from the system", () => {
  authAPI.logout(currentToken).then((response) => {
    apiResponse = response;
    cy.wrap(response).as("logoutResponse");
  });
});

Then("a user should receive a successful registration response", () => {
  cy.get("@registrationResponse").then((response) => {
    authAPI.validateStandardResponse(response, StatusCode.SuccessCreated);
  });
});

Then("a user should get an authentication token", () => {
  cy.get("@registrationResponse").then((response) => {
    extractTokenFromResponse(response);
  });
});

Then("the response should include user details", () => {
  cy.get("@registrationResponse").then((response) => {
    authAPI.validateRegistrationResponse(response, StatusCode.SuccessCreated);
  });
});

Then("a user should receive a validation error", () => {
  cy.get("@registrationResponse").then((response) => {
    authAPI.validateStandardResponse(
      response,
      StatusCode.ClientErrorBadRequest
    );
  });
});

Then("the error message should indicate invalid email format", () => {
  cy.get("@registrationResponse").then((response) => {
    const actualResponse = authAPI.normalizeResponse(response);
    expect(actualResponse.body.message).to.match(/email|invalid|format/i);
  });
});

Then("a user should receive a successful login response", () => {
  cy.get("@loginResponse").then((response) => {
    authAPI.validateStandardResponse(response, StatusCode.SuccessOK);
  });
});

Then("a user should get a valid authentication token", () => {
  cy.get("@loginResponse").then((response) => {
    extractTokenFromResponse(response);
  });
});

Then("the token should not be expired", () => {
  authAPI.getProfile(currentToken).then((response) => {
    authAPI.validateStandardResponse(response, StatusCode.SuccessOK);
  });
});

Then("a user should receive an authentication error", () => {
  cy.get("@loginResponse").then((response) => {
    authAPI.validateStandardResponse(
      response,
      StatusCode.ClientErrorUnauthorized
    );
  });
});

Then("a user should not receive an authentication token", () => {
  cy.get("@loginResponse").then((response) => {
    const actualResponse = authAPI.normalizeResponse(response);
    expect(actualResponse.body).to.not.have.nested.property("data.token");
  });
});

Then("a user should receive a successful logout response", () => {
  cy.get("@logoutResponse").then((response) => {
    authAPI.validateStandardResponse(response, StatusCode.SuccessOK);
  });
});

Then("the authentication token should be invalidated", () => {
  authAPI.getProfile(currentToken).then((response) => {
    expect(response.status).to.eq(StatusCode.ClientErrorUnauthorized);
  });
});
