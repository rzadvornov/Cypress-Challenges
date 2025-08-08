export abstract class BasePage {
  
  protected elements = {
    username: () => cy.get('#username'),
    password: () => cy.get('#password'),
    alert: () => cy.get('#flash'),
    alertCloseButton: () => cy.get('#flash > button')
  };

  abstract verifyPageLoaded(): void;

  fillUsername(value: string) {
    const field = this.elements.username();
    field.clear();
    field.type(value);
    return this;
  }

  fillPassword(value: string) {
    const field = this.elements.password();
    field.clear();
    field.type(value);
    return this;
  }

  getAlert() {
    return this.elements.alert();
  }

  closeAlert() {
    this.elements.alertCloseButton().click();
  }
}