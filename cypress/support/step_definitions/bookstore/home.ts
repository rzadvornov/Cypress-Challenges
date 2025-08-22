import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { homePage } from "../../../e2e/elements/pages/bookstore/HomePage";

const verifyHomePageLoaded = () => {
  homePage.verifyPageLoaded();
};

Given("the user is on the bookstore Homepage", () => {
  homePage.visit();
});

Given("the bookstore Homepage has loaded completely", verifyHomePageLoaded);

Given("the user clicks on a book titled {string}", (title: string) => {
  homePage.selectBook(title);
});

Given("the user views the site on a device with resolution {string}", (resolution: string) => {
  homePage.setResolution(resolution);
});

When("the user enters {string} in the search field", (searchTerm: string) => {
  homePage.enterSearchTerm(searchTerm);
});

When("the user clicks the 'Search' button", () => {
  homePage.search();
});

When("the user selects category {string} from the category filter", (categoryId: string) => {
  homePage.selectCategory(categoryId);
});

When("the user clicks on 'Sign In' button at 'Bookstore Home' page", () => {
  homePage.signIn();
});

Then("the user should see the bookstore logo", () => {
  homePage.verifyBookstoreLogo();
});

Then("the user should see a list of available books", () => {
  homePage.verifyAvailableBooks();
});
    
Then("each book should display title, author, and price", () => {
  homePage.verifyEachBookHasAttributes();
});

Then("the user should see navigation elements", () => {
  homePage.verifyNavigationElements();
});

Then("the user should see search results for {string}", () => {
  homePage.verifySearchExecuted();
});

Then("each result should contain {string} in the title", (searchTerm: string) => {
  homePage.verifySearchResult(searchTerm);
});

Then("the user should be redirected to bookstore Homepage", verifyHomePageLoaded);
