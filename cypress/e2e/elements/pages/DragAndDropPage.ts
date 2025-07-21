import { BasePage } from "./BasePage";

class DragAndDropPage extends BasePage {
  
  visit() {
    cy.visit('/drag-and-drop');
  }

  verifyElement(element: string) {
    cy.get(`#column-${element.toLowerCase()}`)
        .should('be.visible')
        .find('header')
        .should('contain.text', element);
  }
  
  verifyPageLoaded(): void {
    cy.shouldExistAndBeVisible(`#column-a`);
    cy.shouldExistAndBeVisible(`#column-b`);
  }

  performDragAndDrop(elementA: string, elementB: string) {
    cy.get(`#column-${elementA.toLowerCase()}`).drag(`#column-${elementB.toLowerCase()}`); 
  }

  verifyDragAndDrop(element: string, column: string) {
    cy.get('#dnd-columns .column').eq(parseInt(column, 10))
        .find('header')
        .should('contain.text', element);
  }
}

export const dragAndDropPage = new DragAndDropPage();