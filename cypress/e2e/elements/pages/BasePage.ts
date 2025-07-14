export abstract class BasePage {

  getAlert() {
    return cy.get(`#flash`);
  }

  closeAlert() {
    cy.get(`#flash > button`).click();
  }

}