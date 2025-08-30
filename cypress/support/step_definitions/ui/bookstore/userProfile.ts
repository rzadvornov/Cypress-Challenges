import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";
import { userProfilePage } from "../../../../e2e/ui/pages/bookstore/UserProfilePage";
import { shoppingCartPage } from "../../../../e2e/ui/pages/bookstore/ShoppingCartPage";

Given("the user is logged out", () => {
  userProfilePage.logout();
});

Then("the user should be logged in", () => {
  userProfilePage.verifyMenuElements();
});

Then("the user should see his account dashboard", () => {
  userProfilePage.verifyPageLoaded();
});

Then("the order information should be present", () => {
  userProfilePage.verifyOrder();
  userProfilePage.verifyTotalAmount(shoppingCartPage.getTotalOrderAmount());
});
