/// <reference types="cypress" />

describe('Connexion', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('affiche la page de connexion', () => {
    cy.contains('Connexion').should('be.visible');
    cy.get('input[formcontrolname="login"]').should('be.visible');
    cy.get('input[formcontrolname="password"]').should('be.visible');
    cy.contains('Se connecter').should('be.visible');
  });

  it('connexion avec identifiants valides redirige vers /students', () => {
    cy.intercept('POST', '**/api/login', {
      statusCode: 200,
      body: 'fake-jwt-token',
      headers: { 'Content-Type': 'text/plain' },
    }).as('login');
    cy.get('input[formcontrolname="login"]').type('user');
    cy.get('input[formcontrolname="password"]').type('pass');
    cy.contains('Se connecter').click();
    cy.url({ timeout: 10000 }).should('include', '/students');
  });
});
