import { BasePage } from "./BasePage";

class FileUploadPage extends BasePage {
  
  protected fileUploadElements = {
    fileInput: () => cy.get('#fileInput'),
    fileSubmit: () => cy.get('#fileSubmit'),
    warningMessage: () => cy.get('#core >> div:has(> h1)> p'),
    uploadedFiles: () => cy.get('#uploaded-files'),
    pageHeader: () => cy.get('h1')
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

  verifyPageLoaded() {
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
