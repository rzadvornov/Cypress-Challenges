import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { notFoundPage } from "../../../e2e/elements/pages/bookstore/NotFoundPage";

Given("the user navigates to a non-existent page", () => {
  notFoundPage.visitNotExistedPage(`/bookstore/non-existent-page`);
}); 

Given("the user should see a 404 error page", () => {
  notFoundPage.verifyPageLoaded();
});

When("the user clicks on return to the homepage button", () => {
  notFoundPage.clickBackToHomePageButton();
});

Then("the user should be returned to homepage", () => {
  notFoundPage.verifyHomePage();
});