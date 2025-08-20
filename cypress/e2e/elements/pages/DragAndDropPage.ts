import { BasePage } from "./BasePage";

class DragAndDropPage extends BasePage {
  
  protected dragDropElements = {
    columnA: () => cy.get('#column-a'),
    columnB: () => cy.get('#column-b'),
    column: (element: string) => cy.get(`#column-${element.toLowerCase()}`),
    columnHeader: (element: string) => cy.get(`#column-${element.toLowerCase()}`).find('header'),
    dndColumns: () => cy.get('#dnd-columns .column'),
    columnByIndex: (index: number) => cy.get('#dnd-columns .column').eq(index)
  };

  visit() {
    cy.visit(`${Cypress.env('drag_and_drop_url')}`);
  }

  verifyElement(element: string) {
    this.dragDropElements.column(element)
      .should('be.visible');
    
    this.dragDropElements.columnHeader(element)
      .should('contain.text', element);
  }

  verifyPageLoaded(): void {
    this.elements.baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('Drag and Drop Page', { scope: selector });
      });
  }

  performDragAndDrop(elementA: string, elementB: string) {
    this.dragDropElements.column(elementA).drag(`#column-${elementB.toLowerCase()}`);
  }

  verifyDragAndDrop(element: string, column: string) {
    this.dragDropElements.columnByIndex(parseInt(column, 10))
      .find('header')
      .should('contain.text', element);
  }
}

export const dragAndDropPage = new DragAndDropPage();