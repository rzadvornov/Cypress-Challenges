import { BasePage } from "./BasePage";

class FileUploadPage extends BasePage {
  
  submit() {
    cy.get(`#fileSubmit`).click();
  }

  selectFile(path: string) {
    cy.get(`#fileInput`).selectFile(path);
  }

  visit() {
    cy.visit('/upload');
  }

  verifyPageLoaded() {
    cy.shouldExistAndBeVisible(`#core >> div:has(> h1)> p`)
      .and('have.css', 'background-color', 'rgb(255, 193, 7)')
      .contains('Only a file less than 500KB will be accepted.');
    cy.shouldExistAndBeVisible(`#fileSubmit`)
      .and('have.css', 'background-color', 'rgb(13, 110, 253)');
    this.verifyFileInput();
  }

  verifyFileInput() {
    cy.shouldExistAndBeVisible(`#fileInput`);
  }

  verifyFileUploaded(fileName: string) {
    this.verifyFileUploadHeader();
    cy.shouldExistAndBeVisible(`#uploaded-files`)
      .and('have.css', 'background-color', 'rgb(207, 244, 252)')
      .contains(fileName);
  }

  verifyFileUploadHeader() {
    cy.shouldExistAndBeVisible(`h1`).contains('File Uploaded!');
  }

  verifyFileValidationError() {
    const alert = this.getAlert();
    alert.should('have.css', 'background-color', 'rgb(248, 215, 218)')
         .contains('File too large, please select a file less than 500KB');
  }
}

export const fileUploadPage = new FileUploadPage();
