import { BasePage } from "./BasePage";

class ShadowDomPage extends BasePage {
  
  private readonly shadowDomSelectors = {
    body: 'body',
    primaryButton: '#my-btn.btn-primary',
    pageHeader: 'h1',
    shadowHost: '#shadow-host',
    shadowDomButton: '#my-btn'
  } as const;

  protected shadowDomElements = {
    body: () => cy.get(`${this.shadowDomSelectors.body}`),
    document: () => cy.document(),
    primaryButton: () => cy.get(`${this.shadowDomSelectors.primaryButton}`),
    pageHeader: () => cy.get(`${this.shadowDomSelectors.pageHeader}`),
    shadowHost: () => cy.get(`${this.shadowDomSelectors.shadowHost}`),
    shadowDomButton: () => cy.get(`${this.shadowDomSelectors.shadowHost}`)
     .find(`${this.shadowDomSelectors.shadowDomButton}`)
  };
  
  inspectStructure() {
    this.shadowDomElements.body().should('be.visible');
    this.shadowDomElements.document().should('exist');
  }

  visit() {
    cy.visit(`${Cypress.env('shadow_dom_url')}`);
  }
  
  verifyPageUrl() {
    cy.url().should('eq', `${Cypress.config().baseUrl}${Cypress.env('shadow_dom_url')}`);
  }

  verifyPageLoaded(): void {
    this.verifyPageUrl();
    this.elements.baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('Shadow Dom Page', { scope: selector });
      });
    this.shadowDomElements.primaryButton()
      .should('be.visible')
      .contains("Here's a basic button example.");
    
    this.shadowDomElements.pageHeader()
      .should('be.visible')
      .contains('Shadow DOM');
    
    this.verifyShadowDomButton();
  }

  verifyShadowDomButton() {
    this.shadowDomElements.shadowDomButton()
      .should('be.visible')
      .contains("This button is inside a Shadow DOM.");
  }

  verifyShadowHost() {
    cy.hasShadowRoot(`#shadow-host`);
  }

  verifyShadowRoot() {
    this.shadowDomElements.shadowHost().then(($el) => {
      const element = $el[0];
      expect(element.shadowRoot).to.not.be.null;
      cy.log('Shadow root found:', element.shadowRoot);
    }); 
  }

  verifyShadowRootModes() {
    cy.getShadowRootMode(`#shadow-host`).should('be.oneOf', ['open', 'closed']);
  }
}

export const shadowDomPage = new ShadowDomPage();