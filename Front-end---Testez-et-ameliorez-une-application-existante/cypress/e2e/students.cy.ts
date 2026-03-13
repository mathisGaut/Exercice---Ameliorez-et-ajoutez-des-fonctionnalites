/// <reference types="cypress" />

describe('Liste des étudiants', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/login', {
      statusCode: 200,
      body: 'fake-jwt-token',
      headers: { 'Content-Type': 'text/plain' },
    }).as('login');
    cy.intercept('GET', '**/api/students', { body: [] }).as('getStudents');
    cy.visit('/login');
    cy.get('input[formcontrolname="login"]').type('user');
    cy.get('input[formcontrolname="password"]').type('pass');
    cy.contains('Se connecter').click();
    cy.url({ timeout: 10000 }).should('include', '/students');
  });

  it('affiche la liste des étudiants après connexion', () => {
    cy.contains('Liste des étudiants').should('be.visible');
    cy.contains('Ajouter un étudiant').should('be.visible');
  });

  it('affiche le tableau ou le message "Aucun étudiant"', () => {
    cy.get('body').then(($body) => {
      if ($body.find('table').length) {
        cy.get('table').should('be.visible');
      } else {
        cy.contains('Aucun étudiant trouvé').should('be.visible');
      }
    });
  });
});
