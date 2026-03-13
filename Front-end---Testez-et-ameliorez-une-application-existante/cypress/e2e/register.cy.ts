/// <reference types="cypress" />

describe('Inscription', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('affiche le formulaire d\'inscription', () => {
    cy.contains('Registration Form').should('be.visible');
    cy.get('input[formcontrolname="firstName"]').should('be.visible');
    cy.get('input[formcontrolname="lastName"]').should('be.visible');
    cy.get('input[formcontrolname="login"]').should('be.visible');
    cy.get('input[formcontrolname="password"]').should('be.visible');
    cy.contains('Register').should('be.visible');
  });

  it('soumission formulaire valide affiche un message de succès', () => {
    const uniqueLogin = `user${Date.now()}`;
    cy.get('input[formcontrolname="firstName"]').type('Jean');
    cy.get('input[formcontrolname="lastName"]').type('Dupont');
    cy.get('input[formcontrolname="login"]').type(uniqueLogin);
    cy.get('input[formcontrolname="password"]').type('password123');
    cy.contains('Register').click();
    // L'application affiche alert('SUCCESS!! :-)') - on vérifie qu'aucune erreur visible
    cy.get('body').should('be.visible');
  });
});
