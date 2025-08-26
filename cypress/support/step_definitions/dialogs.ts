import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { dialogsPage } from "../../e2e/ui/pages/DialogsPage";

Given("the user is on the Dialogs practice page", () => {
  dialogsPage.visit();
});

Given("the user have configured confirm handling to accept", () => {
  dialogsPage.setupJsConfirmationHanding(true);
});

Given("the user have configured confirm handling to dismiss", () => {
  dialogsPage.setupJsConfirmationHanding(false);
})

Given("the Dialogs page has loaded completely", () => {
  dialogsPage.verifyPageLoaded();
});

Given("the user have set up alert handling", () => {
  dialogsPage.setupJsAlertHanding();
});

Given("the user have configured prompt handling to return {string}", (message: string) => {
  dialogsPage.setupJsPromptHanding(message);
});

Given("the user have configured prompt handling to dismiss", () => {
  dialogsPage.setupJsPromptHanding(null);
});

When("the user clicks the 'Alert' button", () => {
  dialogsPage.clickJsAlertButton();
});

When("the user clicks the 'Confirm' button", () => {
  dialogsPage.clickJsConfirmButton();
});

When("the user clicks the 'Prompt' button", () => {
  dialogsPage.clickJsPromptButton();
});

Then("the alert should be triggered", () => {
  dialogsPage.verifyJsAlert();
});

Then("the confirm dialog should be triggered", () => {
  dialogsPage.verifyJsConfirmation();
});

Then("the prompt dialog should be triggered", () => {
  dialogsPage.verifyJsPrompt();
});

Then("the Dialogs page should display {string}", (message: string) => {
  dialogsPage.verifyDialogResponse(message);
});

