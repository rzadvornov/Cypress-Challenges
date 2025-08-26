import { BasePage } from "./BasePage";

class DragAndDropPage extends BasePage {
  
  private readonly dragDropSelectors = {
    columnA: '#column-a',
    columnB: '#column-b',
    columnPrefix: '#column-',
    dndColumnsContainer: '#dnd-columns',
    columnClass: '.column',
    headerTag: 'header'
  } as const;

  protected dragDropElements = {
    columnA: () => cy.get(`${this.dragDropSelectors.columnA}`),
    columnB: () => cy.get(`${this.dragDropSelectors.columnB}`),
    column: (element: string) => cy.get(`${this.dragDropSelectors.columnPrefix}${element.toLowerCase()}`),
    columnHeader: (element: string) => cy.get(`${this.dragDropSelectors.columnPrefix}${element.toLowerCase()}`)
      .find(`${this.dragDropSelectors.headerTag}`),
    dndColumns: () => cy.get(`${this.dragDropSelectors.dndColumnsContainer}`)
      .find(`${this.dragDropSelectors.columnClass}`),
    columnByIndex: (index: number) => cy.get(`${this.dragDropSelectors.dndColumnsContainer}`)
      .find(`${this.dragDropSelectors.columnClass}`).eq(index)
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

  verifyPageUrl() {
    cy.url().should('eq', `${Cypress.config().baseUrl}${Cypress.env('drag_and_drop_url')}`);
  }

  verifyPageLoaded(): void {
    this.verifyPageUrl();
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