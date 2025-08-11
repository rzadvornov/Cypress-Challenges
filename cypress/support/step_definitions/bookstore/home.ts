import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { homepage } from "../../../e2e/elements/pages/bookstore/HomePage";

Given("the user is on the bookstore Homepage", () => {
  homepage.visit();
});

Given("the bookstore Homepage has loaded completely", () => {
  homepage.verifyPageLoaded();
});

When("the user enters {string} in the search field", (searchTerm: string) => {
  homepage.enterSearchTerm(searchTerm);
});

When("the user clicks the 'Search' button", () => {
  homepage.search();
});

When("the user selects category {string} from the category filter", (categoryId: string) => {
  homepage.selectCategory(categoryId);
});

Then("the user should see the bookstore logo", () => {
  homepage.verifyBookstoreLogo();
});

Then("the user should see a list of available books", () => {
  homepage.verifyAvailableBooks();
});
    
Then("each book should display title, author, and price", () => {
  homepage.verifyEachBookHasAttributes();
});

Then("the user should see navigation elements", () => {
  homepage.verifyNavigationElements();
});

Then("the user should see search results for {string}", () => {
  homepage.verifySearchExecuted();
});

Then("each result should contain {string} in the title", (searchTerm: string) => {
  homepage.verifySearchResult(searchTerm);
});