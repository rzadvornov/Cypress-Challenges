import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { shadowDomPage } from "../../e2e/elements/pages/ShadowDomPage";

Given("the user is on the Shadow DOM page", () => {
  shadowDomPage.visit();
});

Given("the Shadow Dom page content is displayed", () => {
  shadowDomPage.verifyPageLoaded();
});

Given("user inspects the page structure", () => {
  shadowDomPage.inspectStructure();
});

Given("there is a shadow DOM host element present", () => {
  shadowDomPage.verifyShadowHost();
});

When("user accesses the shadow root of the host element", () => {
  shadowDomPage.verifyShadowRoot();
});

When("user locates a button within the shadow DOM", () => {
  shadowDomPage.verifyShadowDomButton();
});

Then("user should be able to identify the shadow DOM host element", () => {
  shadowDomPage.verifyShadowHost();
});

Then('the host element should have a shadow root attached', () => {
  shadowDomPage.verifyShadowRoot();
});

Then("the shadow root mode should be either 'open' or 'closed'", () => {
  shadowDomPage.verifyShadowRootModes();
});
