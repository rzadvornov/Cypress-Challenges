import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { shoppingCartPage } from "../../../e2e/elements/pages/bookstore/ShoppingCartPage";

When("the user changes the quantity to {string}", (quantity: string) => {
  shoppingCartPage.setQuantity(quantity);
});

When("the user clicks 'Delete' button for {string}", (title: string) => {
  shoppingCartPage.deleteBookFromCart(title);
});

Then("the cart page should load", () => {
  shoppingCartPage.verifyPageLoaded();
});

Then("the user should see {string} in his cart", (title: string) => {
  shoppingCartPage.verifyTitle(title);
});

Then("the user should see the correct price for the item", () => {
  shoppingCartPage.verifyPrice();
});

Then("the total price should update accordingly", () => {
  shoppingCartPage.verifyTotalChange();
});

Then("the item should be removed from his cart", () => {
  shoppingCartPage.verifyCartIsCleaned();
});

Then("the cart should show as empty", () => {
  shoppingCartPage.verifyEmptyCart();
});