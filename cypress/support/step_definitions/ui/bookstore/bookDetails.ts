import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { bookDetailsPage } from "../../../../e2e/ui/pages/bookstore/BookDetailsPage";

When("the user clicks the 'Add to Cart' button", () => {
  bookDetailsPage.clickAddToCartButton();
});

Then("the user should be redirected to the Book Details page", () => {
  bookDetailsPage.verifyPageLoaded();
});

Then("the user should see the book title {string}", (title: string) => {
  bookDetailsPage.verifyBookTitle(title);
});

Then("the user should see the book price", () => {
  bookDetailsPage.verifyBookPrice();
});

Then("the user should see a book description", () => {
  bookDetailsPage.verifyBookDescription();
});

Then("the user should see an 'Add to Cart' button", () => {
  bookDetailsPage.verifyAddToCartButton();
});

Then("the cart counter should increase by 1", () => {
  bookDetailsPage.verifyBookCounter();
});
