/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to pierce through Shadow DOM
       * @param selector CSS selector for the shadow host
       * @returns Cypress chainable object
       * @example cy.getShadowElement('[data-cy="shadow-host"]')
       */
      getShadowElement(selector: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to find element within shadow DOM using CSS piercing
       * @param selector CSS selector that pierces shadow boundaries
       * @returns Cypress chainable object
       * @example cy.getShadowElementByPiercing('shadow-host >>> button')
       */
      getShadowElementByPiercing(selector: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to traverse nested shadow DOM
       * @param selectors Array of selectors for each shadow level
       * @returns Cypress chainable object
       * @example cy.getNestedShadowElement(['host1', 'host2', 'target'])
       */
      getNestedShadowElement(selectors: string[]): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to check if element has shadow root
       * @param selector CSS selector for potential shadow host
       * @example cy.hasShadowRoot('[data-cy="shadow-host"]')
       */
      hasShadowRoot(selector: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to get shadow root mode
       * @param selector CSS selector for shadow host
       * @returns Shadow root mode or status
       * @example cy.getShadowRootMode('[data-cy="shadow-host"]').should('equal', 'open')
       */
      getShadowRootMode(selector: string): Chainable<string>;
      
      /**
       * Custom command to check if element has shadow root and verify its accessibility
       * @param selector CSS selector for shadow host
       * @returns Cypress chainable object
       * @example cy.verifyShadowRoot('[data-cy="shadow-host"]')
       */
      verifyShadowRoot(selector: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to check if element exists and is visible
       * @param selector CSS selector for the element
       * @returns Cypress chainable object
       * @example cy.shouldExistAndBeVisible('[data-cy="element"]')
       */
      shouldExistAndBeVisible(selector: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('shouldExistAndBeVisible', (selector: string) => {
  return cy.get(selector).should('exist').and('be.visible');
});

/**
 * Custom command to pierce through Shadow DOM
 * @param {string} selector - CSS selector for the shadow host
 * @returns {Chainable} Cypress chainable object
 */
Cypress.Commands.add('getShadowElement', (selector) => {
  return cy.get(selector).shadow();
});

/**
 * Custom command to find element within shadow DOM using CSS piercing
 * @param {string} selector - CSS selector that pierces shadow boundaries
 * @returns {Chainable} Cypress chainable object
 */
Cypress.Commands.add('getShadowElementByPiercing', (selector) => {
  return cy.get(selector, { includeShadowDom: true });
});

/**
 * Custom command to traverse nested shadow DOM
 * @param {string[]} selectors - Array of selectors for each shadow level
 * @returns {Chainable} Cypress chainable object
 */
Cypress.Commands.add('getNestedShadowElement', (selectors) => {
  let chain = cy.get(selectors[0]);
  
  for (let i = 1; i < selectors.length; i++) {
    if (i === 1) {
      chain = chain.shadow().find(selectors[i]);
    } else {
      chain = chain.shadow().find(selectors[i]);
    }
  }
  
  return chain;
});

/**
 * Custom command to check if element has shadow root
 * @param {string} selector - CSS selector for potential shadow host
 */
Cypress.Commands.add('hasShadowRoot', (selector) => {
  return cy.get(selector).then(($el) => {
    const element = $el[0];
    expect(element.shadowRoot).to.not.be.null;
  });
});

/**
 * Custom command to get shadow root mode
 * @param {string} selector - CSS selector for shadow host
 * @returns {Chainable} Cypress chainable object with shadow root mode
 */
Cypress.Commands.add('getShadowRootMode', (selector) => {
  return cy.get(selector).then(($el) => {
    const element = $el[0];
    if (element.shadowRoot) {
      return cy.wrap('open');
    } else {
      // Check if shadowRoot is explicitly null or undefined
      return cy.wrap(element.shadowRoot === null ? 'null' : 'closed');
    }
  });  

});
