import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { dashboardPage } from "../../../e2e/ui/pages/DashboardPage";
import { loginPage } from "../../../e2e/ui/pages/LoginPage";

const verifyDisconnectedSession = () => {
  dashboardPage.verifyDisconnectedSession();
};

When("the user clicks Logout button", () => {
  dashboardPage.signOut();
});

Then("the user should be redirected to the dashboard page", () => {
  dashboardPage.verifyPageLoaded();
});

Then("the user should see greeting message", () => {
  dashboardPage.verifyGreetingMessage(loginPage.getUsername());
});

Then(
  "the user should see a {string} alert message",
  function (alertMessage: string) {
    const alert = dashboardPage.getAlert();
    alert.should("have.css", "background-color", "rgb(209, 231, 221)");
    alert.contains(alertMessage);
  }
);

Then("the user session should be established", () => {
  dashboardPage.verifyUserSession();
});

Then("the user session should be disconnected", verifyDisconnectedSession);

Then("no user session should be established", verifyDisconnectedSession);
