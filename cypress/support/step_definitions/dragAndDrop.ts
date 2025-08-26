import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { dragAndDropPage } from "../../e2e/ui/pages/DragAndDropPage";

const verifyElement = (element: string) => {
  dragAndDropPage.verifyElement(element);
};

Given("the user is on the Drag and Drop page", () => {
  dragAndDropPage.visit();
});

Given("all drag and drop elements are visible and interactive", () => {
  dragAndDropPage.verifyPageLoaded();
});

Given("the user can see element {string} in the source container", verifyElement);

Given("the user can see element {string} in the target container", verifyElement);

When("the user drags and drops element {string} to the target drop zone of element {string}", (elementA: string, elementB: string) => {
  dragAndDropPage.performDragAndDrop(elementA, elementB);
});

Then("the target container should display {string} at column {string}", (element: string, column: string) => {
  dragAndDropPage.verifyDragAndDrop(element, column);
});

Then("the source container should display {string} at column {string}", (element: string, column: string) => {
  dragAndDropPage.verifyDragAndDrop(element, column);
});