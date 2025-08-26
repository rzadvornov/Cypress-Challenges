export abstract class BasePage {
  
  private readonly baseSelectors = {
    coreContainer: '#core',
    usernameInput: '#username',
    passwordInput: '#password',
    flashAlert: '#flash',
    flashCloseButton: '#flash > button'
  } as const;

  protected elements = {
    baseContainer: () => cy.get(`${this.baseSelectors.coreContainer}`),
    username: () => cy.get(`${this.baseSelectors.usernameInput}`),
    password: () => cy.get(`${this.baseSelectors.passwordInput}`),
    alert: () => cy.get(`${this.baseSelectors.flashAlert}`),
    alertCloseButton: () => cy.get(`${this.baseSelectors.flashCloseButton}`)
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