import { Singleton } from "../../../../support/utilities/Decorators";
import { BasePage } from "../BasePage";
import { faker } from '@faker-js/faker';

const defaultPassword = 'SecurePass123!';
const EMPTY_CREDENTIALS = { email: '', password: '' };

@Singleton
class SignUpPage extends BasePage {
  
  private readonly signUpSelectors = {
    signUpHeader: 'h1',
    emailInput: '#email',
    confirmPasswordInput: '#password2',
    signUpButton: '#submit',
    signInLink: 'a[href*="/bookstore/user/signin"]',
    navigationBar: '#navbarDropdown',
    profileLink: '#profile',
    logoutLink: '#logout'
  } as const;

  protected signUpElements = {
    signUp: () => cy.get(`${this.signUpSelectors.signUpHeader}`),
    email: () => cy.get(`${this.signUpSelectors.emailInput}`),
    confirmPassword: () => cy.get(`${this.signUpSelectors.confirmPasswordInput}`),
    signUpButton: () => cy.get(`${this.signUpSelectors.signUpButton}`),
    signInButton: () => cy.get(`${this.signUpSelectors.signInLink}`),
    navigationBar: () => cy.get(`${this.signUpSelectors.navigationBar}`),
    profile: () => cy.get(`${this.signUpSelectors.profileLink}`),
    logout: () => cy.get(`${this.signUpSelectors.logoutLink}`)
  };

  #username: string;
  #password: string;
  #email: string;

  constructor(username: string, password: string, email: string) {
    super();
    this.#username = username;
    this.#password = password;
    this.#email = email;
  }

  getEmail(): string {
    return this.#email;
  }

  getUsername(): string {
    return this.#username;
  }

  getPassword() {
    return this.#password;
  }

  fillEmail(email: string) {
    this.#email = email === '[random]' ? faker.internet.email() : email;
    this.signUpElements.email()
      .clear()
      .type(this.#email);
    return this;
  }

  fillUsername(value: string) {
    this.#username = value === '[random]' ? faker.internet.username() : value;
    super.fillUsername(this.#username);
    return this;
  }

  fillPassword(value: string) {
    this.#password = value;
    super.fillPassword(this.#password);
    return this;
  }

  fillPasswordConfirmation(password: string) {
    this.signUpElements.confirmPassword()
      .clear()
      .type(password);
    return this;
  }

  login() {
    this.signUpElements.signInButton().click();
  }

  submit() {
    this.signUpElements.signUpButton().click();
  }

  #hasEmptyCredentials() {
  return this.#email === EMPTY_CREDENTIALS.email && 
         this.#password === EMPTY_CREDENTIALS.password;
  }

  #registerNewUser() {
    const steps = [
      () => this.visit(),
      () => this.fillUsername('[random]'),
      () => this.fillEmail('[random]'),
      () => this.fillPassword(defaultPassword),
      () => this.fillPasswordConfirmation(defaultPassword),
      () => this.submit()
    ];
  
    for (const step of steps) {
      step();
    }
  }

  registerUser() {
    if (this.#hasEmptyCredentials()) {
      this.#registerNewUser();
    }
  }

  visit() {
    cy.visit(`${Cypress.env('bookstore_url')}${Cypress.env('signUp_url')}`);
  }

  verifyPageUrl() {
    cy.url().should('eq', `${Cypress.config().baseUrl}${Cypress.env('bookstore_url')}${Cypress.env('signUp_url')}`);
  }

  verifyPageLoaded(): void {
    this.verifyPageUrl();
    this.elements.baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('SignUp Page', { scope: selector });
      });
    this.signUpElements.signUp()
      .should('be.visible')
      .contains('Sign up');
    this.signUpElements.signUpButton()
      .should('be.visible')
      .contains('Sign Up');
    this.signUpElements.signInButton()
      .should('be.visible')
      .contains('Sign in!');
  }
}

export const signUpPage = new SignUpPage("", "", "");