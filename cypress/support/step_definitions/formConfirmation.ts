import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { formConfirmationPage } from "../../e2e/elements/pages/FormConfirmationPage";

Then("the form should be submitted", () => {
  formConfirmationPage.verifyPageLoaded();
  formConfirmationPage.verifyAlertMessage();
 });