import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";
import { userProfilePage } from "../../../e2e/elements/pages/bookstore/UserProfilePage";

Given("the user is logged out", () => {
  userProfilePage.logout();
});

Then("the user should be logged in", () => {
  userProfilePage.verifyMenuElements();
});

Then("the user should see his account dashboard", () => {
  userProfilePage.verifyPageLoaded();
});