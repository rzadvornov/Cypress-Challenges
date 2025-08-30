import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { registrationPage } from "../../../e2e/ui/pages/RegistrationPage";
import { StringUtils } from "../../utilities/StringUtils";

const verifyRegistrationPage = () => {
  registrationPage.verifyPageLoaded();
};

Given("the user is on the Registration page", () => {
  registrationPage.visit();
});

Given("the registration form is displayed", verifyRegistrationPage);

Given("the user enters a valid generated username", () => {
  const username = StringUtils.generateRandomString(10);
  registrationPage.fillUsername(username);
});

Given("the user enters a valid password {string}", (password: string) => {
  registrationPage.fillPassword(password);
});

Given("the user confirms the password {string}", (password: string) => {
  registrationPage.fillPasswordConfirmation(password);
});

Given("the user leaves empty the username field", () => {
  registrationPage.clearUsername();
});

Given(
  "the user enters a valid existing username {string}",
  function (username: string) {
    registrationPage.fillUsername(username);
  }
);

Given(
  "the user enters a invalid username {string}",
  function (username: string) {
    registrationPage.fillUsername(username);
  }
);

When("the user clicks the 'Register' button", () => {
  registrationPage.submit();
});

Then("the user should see {string} message", function (alertMessage: string) {
  const alert = registrationPage.getAlert();
  alert.should("have.css", "background-color", "rgb(207, 244, 252)");
  alert.contains(alertMessage);
});

Then(
  "the user should see {string} error message",
  function (alertMessage: string) {
    const alert = registrationPage.getAlert();
    alert.should("have.css", "background-color", "rgb(248, 215, 218)");
    alert.contains(alertMessage);
  }
);

Then("the user should remain on the Registration page", verifyRegistrationPage);
