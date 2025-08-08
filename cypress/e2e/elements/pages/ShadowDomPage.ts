import { BasePage } from "./BasePage";

class ShadowDomPage extends BasePage {
  
  protected shadowDomElements = {
    body: () => cy.get('body'),
    document: () => cy.document(),
    primaryButton: () => cy.get('#my-btn.btn-primary'),
    pageHeader: () => cy.get('h1'),
    shadowHost: () => cy.get('#shadow-host'),
    shadowDomButton: () => cy.get('#shadow-host').find('#my-btn')
  };
  
  inspectStructure() {
    this.shadowDomElements.body().should('be.visible');
    this.shadowDomElements.document().should('exist');
  }

  visit() {
    cy.visit('/shadowdom');
  }
  
  verifyPageLoaded(): void {
    this.shadowDomElements.primaryButton()
      .should('exist')
      .and('be.visible')
      .and('have.css', 'background-color', 'rgb(13, 110, 253)')
      .contains("Here's a basic button example.");
    
    this.shadowDomElements.pageHeader()
      .should('contain.text', 'Shadow DOM');
    
    this.verifyShadowDomButton();
  }

  verifyShadowDomButton() {
    this.shadowDomElements.shadowDomButton()
      .should('have.css', 'background-color', 'rgb(24, 43, 69)')
      .contains("This button is inside a Shadow DOM.");
  }

  verifyShadowHost() {
    this.shadowDomElements.shadowHost()
      .should('exist')
      .and('be.visible');
    
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