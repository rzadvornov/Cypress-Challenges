import { BasePage } from "../BasePage";

class UserProfilePage extends BasePage {
  
  private orderID: string = "";
  
  private readonly userProfileSelectors = {
    navbarDropdown: '#navbarDropdown',
    profile: '#profile',
    logout: '#logout',
    deleteOrdersButton: '#deleteOrdersBtn',
    cardFooter: '.card-footer',
    order: `[data-testid="${this.orderID}"]`,
    totalAmountSpan: 'span'
  } as const;

  protected userProfileElements = {
    menu: () => cy.get(`${this.userProfileSelectors.navbarDropdown}`),
    profile: () => cy.get(`${this.userProfileSelectors.profile}`),
    logout: () => cy.get(`${this.userProfileSelectors.logout}`),
    deleteOrdersButton: () => cy.get(`${this.userProfileSelectors.deleteOrdersButton}`),
    totalAmount: () => cy.get(`${this.userProfileSelectors.order}`)
      .find(`${this.userProfileSelectors.cardFooter}`)
      .find(`${this.userProfileSelectors.totalAmountSpan}`)
  }
  
  logout() {
    this.elements.baseContainer().then(($container) => {
        if ($container.find(this.userProfileSelectors.navbarDropdown).length > 0) {
          this.userProfileElements.menu().click();
          this.userProfileElements.logout().click();
        }
    });
  }

  verifyPageUrl() {
    cy.url().should('include', `${Cypress.config().baseUrl}${Cypress.env('bookstore_url')}${Cypress.env('profile_url')}`);
  }

  verifyPageLoaded(): void {
    this.verifyPageUrl();
    
  }

  verifyOrder() {
    this.verifyNotification();
    this.userProfileElements.deleteOrdersButton()
      .parent()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('User Profile Page', { scope: selector });
      });
  }

  verifyTotalAmount(totalAmount: string) {
    this.userProfileElements.totalAmount()
      .should('be.visible')
      .invoke('text')
      .should('eq', totalAmount);
  }

  verifyNotification() {
    this.getAlert()
      .should('be.visible')
      .and('contain', 'Your purchase was successful!')
      .invoke('text')
      .then((text) => {
        const match = text.match(/Reference ID:\s*([A-Za-z0-9]+)/);
        if (match && match[1]) {
          this.orderID = match[1].trim();
          cy.log(`Extracted Order ID: ${this.orderID}`);
        } else {
          throw new Error('Could not extract Reference ID from alert text');
        }
      })
  }

  verifyMenuElements() {
    this.userProfileElements.menu()
      .should('be.visible')
      .invoke('text')
      .should('have.length.gt', 0);
    this.userProfileElements.profile()
      .should('exist')
      .contains('Profile');
    this.userProfileElements.logout()
      .should('exist')
      .contains('Log Out');
  }
}

export const userProfilePage = new UserProfilePage();