import { BasePage } from "./BasePage";

class ShadowDomPage extends BasePage {
  
  inspectStructure() {
    cy.get(`body`).should('be.visible');
    cy.document().should('exist');
  }

  visit() {
    cy.visit('/shadowdom');
  }
  
  verifyPageLoaded(): void {
    cy.shouldExistAndBeVisible(`#my-btn.btn-primary`)
      .and('have.css', 'background-color', 'rgb(13, 110, 253)')
      .contains("Here's a basic button example.");
    cy.get('h1').should('contain.text', 'Shadow DOM');
    this.verifyShadowDomButton();
  }

  verifyShadowDomButton() {
    cy.get(`#shadow-host`)
      .find(`#my-btn`)
      .should('have.css', 'background-color', 'rgb(24, 43, 69)')
      .contains("This button is inside a Shadow DOM.");
  }

  verifyShadowHost() {
    cy.shouldExistAndBeVisible(`#shadow-host`);
    cy.hasShadowRoot(`#shadow-host`);
  }

  verifyShadowRoot() {
    cy.get(`#shadow-host`).then(($el) => {
    const element = $el[0];
    expect(element.shadowRoot).to.not.be.null;
    cy.log('Shadow root found:', element.shadowRoot);
    }); 
  }

  verifyShadowRootModes() {
    cy.getShadowRootMode(`#shadow-host`).should('be.oneOf', ['open', 'closed']);
  }

};

export const shadowDomPage = new ShadowDomPage();