export abstract class BasePage {

  abstract verifyPageLoaded(): void

  fillUsername(value: string) {
    const field = cy.get(`#username`);
    field.clear();
    field.type(value);
    
    return this;
  }

  fillPassword(value: string) {
    const field = cy.get(`#password`);
    field.clear();
    field.type(value);
    
    return this;
  }

  getAlert() {
    return cy.get(`#flash`);
  }

  closeAlert() {
    cy.get(`#flash > button`).click();
  }

}