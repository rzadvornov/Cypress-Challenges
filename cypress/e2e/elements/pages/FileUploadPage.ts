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
    cy.visit('/upload');
  }

  verifyPageLoaded() {
    this.fileUploadElements.warningMessage()
      .should('exist')
      .and('be.visible')
      .and('have.css', 'background-color', 'rgb(255, 193, 7)')
      .contains('Only a file less than 500KB will be accepted.');
    
    this.fileUploadElements.fileSubmit()
      .should('exist')
      .and('be.visible')
      .and('have.css', 'background-color', 'rgb(13, 110, 253)');
    
    this.verifyFileInput();
  }

  verifyFileInput() {
    this.fileUploadElements.fileInput()
      .should('exist')
      .and('be.visible');
  }

  verifyFileUploaded(fileName: string) {
    this.verifyFileUploadHeader();
    this.fileUploadElements.uploadedFiles()
      .should('exist')
      .and('be.visible')
      .and('have.css', 'background-color', 'rgb(207, 244, 252)')
      .contains(fileName);
  }

  verifyFileUploadHeader() {
    this.fileUploadElements.pageHeader()
      .should('exist')
      .and('be.visible')
      .contains('File Uploaded!');
  }

  verifyFileValidationError() {
    const alert = this.getAlert();
    alert.should('have.css', 'background-color', 'rgb(248, 215, 218)')
         .contains('File too large, please select a file less than 500KB');
  }
}

export const fileUploadPage = new FileUploadPage();
