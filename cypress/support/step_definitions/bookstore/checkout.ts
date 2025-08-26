import { Then, DataTable, When } from "@badeball/cypress-cucumber-preprocessor";
import { checkoutPage } from "../../../e2e/ui/pages/bookstore/CheckoutPage";

When("the user clicks 'Purchase' button", () => {
  checkoutPage.purchase();
});

Then("the Checkout Page should be loaded", () => {
  checkoutPage.verifyPageLoaded();
});

Then("the user enters valid payment information:", (dataTable: DataTable) => {
  const data: Record<string, string> = dataTable.rowsHash();
  
  const fieldActions = {
    'Card Number': checkoutPage.fillCardNumber,
    'Expiration Month': checkoutPage.fillCardExpirationMonth,
    'CVC': checkoutPage.fillCardCVC,
    'Name': checkoutPage.fillName,
    'Address': checkoutPage.fillAddress,
    'Card Holder Name': checkoutPage.fillCardHolderName
  };

  Object.entries(fieldActions).forEach(([key, action]) => {
    if (data[key]) {
      action.call(checkoutPage, data[key]);
    }
  });

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const nextYearTwoDigits = nextYear.toString().slice(-2);
  checkoutPage.fillExpirationYear(nextYearTwoDigits);

});

Then("the user should see error message indicating declined card", () => {
  checkoutPage.verifyErrorNotification();
});