import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { formValidationPage } from "../../e2e/elements/pages/FormValidationPage";
import { StringUtils } from "../utilities/StringUtils";

const verifyFormValidationPage = () => {
  formValidationPage.verifyPageLoaded();
};

Given("the user is on the Form Validation page", () => {
  formValidationPage.visit();
}); 

Given("the validation form is displayed", verifyFormValidationPage);

Given("the user clears 'Contact Name' text field", () => {
  formValidationPage.clearContactName();
});

Given("the user enters an invalid phone number {string}", (contactNumber: string) => {
  formValidationPage.fillContactNumber(contactNumber);
});

Given("the user enters a valid 'Contact Name'", () => {
  const contactName = StringUtils.generateRandomString(5);
  formValidationPage.fillContactName(contactName);
});

Given("the user enters valid phone number {string}", (phoneNumber: string) => {
  formValidationPage.fillContactNumber(phoneNumber);
});

Given("the user enters todays date", () => {
  formValidationPage.fillDate(StringUtils.getCurrentDateStringISOFormat());
});

Given("the user should see a message confirming that the Contact Name is valid", () => {
  formValidationPage.verifyContactNameValidationMessage();
});

Given("the user enters {string} payment method", (paymentMethod: string) => {
  formValidationPage.fillPaymentMethod(paymentMethod);
}); 

When("the user clicks the form 'Register' button", () => {
  formValidationPage.submit();
});

Then("the user should see validation errors for all required fields", () => {
  formValidationPage.verifyAllValidationErrors();
});

Then("the user should see an error message indicating invalid phone format", () => {
  formValidationPage.verifyContactNumberValidationError();
});

Then("the form should not be submitted", verifyFormValidationPage);

Then("the user should see an error message indicating invalid date range", () => {
  formValidationPage.verifyDateValidationError();
});



