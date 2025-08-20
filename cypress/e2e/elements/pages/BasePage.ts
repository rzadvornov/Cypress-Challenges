export abstract class BasePage {
  
  protected elements = {
    baseContainer: () => cy.get('#core'),
    username: () => cy.get('#username'),
    password: () => cy.get('#password'),
    alert: () => cy.get('#flash'),
    alertCloseButton: () => cy.get('#flash > button')
  };

  abstract verifyPageLoaded(): void;

  fillUsername(value: string) {
    this.elements.username()
      .clear()
      .type(value);
    return this;
  }

  fillPassword(value: string) {
    this.elements.password()
      .clear()
      .type(value);
    return this;
  }

  getAlert() {
    return this.elements.alert();
  }

  closeAlert() {
    this.elements.alertCloseButton().click();
  }
}