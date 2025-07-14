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

Then("an error message {string} should be displayed", function (alertMessage: string) {
    const alert = loginPage.getAlert();
    alert.should('have.css', 'background-color', 'rgb(248, 215, 218)');
    alert.contains(alertMessage);
});

Then("the username field should be cleared", () => {
  loginPage.verifyEmptyUsername();
});

Then("the password field should be cleared", () => {
  loginPage.verifyEmptyPassword();
});