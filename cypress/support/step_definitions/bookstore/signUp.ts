import { Given, Then, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import { signUpPage } from "../../../e2e/ui/pages/bookstore/SignUpPage";
import { signInPage } from "../../../e2e/ui/pages/bookstore/SignInPage";

Given("the user has registered account", () => {
  signUpPage.registerUser();
});

Then("the 'Sign Up' page should be loaded", () => {
  signUpPage.verifyPageLoaded();
});

Then("the user fills the registration form with valid details:", (dataTable: DataTable) => {
  const data: Record<string, string> = dataTable.rowsHash();
  
  const fieldActions = {
    'User Name': signUpPage.fillUsername,
    'Email': signUpPage.fillEmail,
    'Password': signUpPage.fillPassword,
    'Confirm Password': signUpPage.fillPasswordConfirmation,
  };

  Object.entries(fieldActions).forEach(([key, action]) => {
    if (data[key]) {
      action.call(signUpPage, data[key]);
    }
  });

});

Then("the user clicks on 'Sign Up' button at 'Sign Up' page", () => {
  signUpPage.submit();
});

Then("the user enters his email", () => {
  signInPage.fillEmail(signUpPage.getEmail());
});

Then("the user enters his password", () => {
  signInPage.fillPassword(signUpPage.getPassword());
});