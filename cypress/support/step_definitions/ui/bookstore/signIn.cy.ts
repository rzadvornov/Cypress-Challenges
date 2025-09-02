import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { signInPage } from "../../../../e2e/ui/pages/bookstore/SignInPage";

When("the user clicks on 'Sign Up' button at 'Sign In' page", () => {
  signInPage.register();
});

Then("the user clicks 'Sign In' button at 'Sign In' page", () => {
  signInPage.submit();
});

Then("the 'Sign In' page should be loaded", () => {
  signInPage.verifyPageLoaded();
});

Then("the user enters email {string}", (email: string) => {
  signInPage.fillEmail(email);
});

Then("the user should see an error message indicating user absense", () => {
  signInPage.verifyLoginError();
});

Then("the user should remain on the 'Sign In' page", () => {
  signInPage.verifyPageUrl();
});
