import { BasePage } from "./BasePage";

class FileUploadPage extends BasePage {
  
  private readonly fileUploadSelectors = {
    fileInput: '#fileInput',
    fileSubmit: '#fileSubmit',
    warningMessage: '#core >> div:has(> h1)> p',
    uploadedFiles: '#uploaded-files',
    pageHeader: 'h1'
  } as const;

  protected fileUploadElements = {
    fileInput: () => cy.get(`${this.fileUploadSelectors.fileInput}`),
    fileSubmit: () => cy.get(`${this.fileUploadSelectors.fileSubmit}`),
    warningMessage: () => cy.get(`${this.fileUploadSelectors.warningMessage}`),
    uploadedFiles: () => cy.get(`${this.fileUploadSelectors.uploadedFiles}`),
    pageHeader: () => cy.get(`${this.fileUploadSelectors.pageHeader}`)
  };

  submit() {
    this.fileUploadElements.fileSubmit().click();
  }

  selectFile(path: string) {
    this.fileUploadElements.fileInput().selectFile(path);
  }

  visit() {
    cy.visit(`${Cypress.env('file_upload_url')}`);
  }

  verifyPageUrl() {
    cy.url().should('eq', `${Cypress.config().baseUrl}${Cypress.env('file_upload_url')}`);
  }

  verifyPageLoaded() {
    this.verifyPageUrl();
    this.elements.baseContainer()
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('File Upload Page', { scope: selector });
      });
    this.fileUploadElements.warningMessage()
      .should('be.visible')
      .contains('Only a file less than 500KB will be accepted.');
  }

  verifyFileUploaded(fileName: string) {
    this.verifyFileUploadHeader();
    this.fileUploadElements.uploadedFiles()
      .should('be.visible')
      .contains(fileName);
  }

  verifyFileUploadHeader() {
    this.fileUploadElements.pageHeader()
      .should('be.visible')
      .contains('File Uploaded!');
  }

  verifyFileValidationError() {
    const alert = this.getAlert();
    alert.should('be.visible')
      .contains('File too large, please select a file less than 500KB')
      .getSelector()
      .then((selector) => {
        cy.percySnapshot('File Upload Page - File Validation Error', { scope: selector });
      });;
    
  }
}

export const fileUploadPage = new FileUploadPage();
