// cypress/e2e/services.cy.js
import { setupClerkTestingToken, addClerkCommands } from '@clerk/testing/cypress';

// Add Clerk custom commands globally
addClerkCommands({ Cypress, cy });

describe('Services Page', () => {
  before(() => {
    // Set up Clerk testing token before all tests
    setupClerkTestingToken();
  });

  beforeEach(() => {
    // Use cy.origin() to ensure commands are executed within the correct origin
    cy.origin('http://localhost:3000', () => { // Adjust the origin if necessary
      // Visit the /services page
      cy.visit('/services');

      // Sign in using Clerk
      cy.clerkSignIn({
        strategy: 'password',
        identifier: 'dbaichi@leoni.com', // Replace with test user credentials
        password: 'Espagne123@'
      }, { timeout: 10000 });

      // Confirm user is signed in
      cy.get('body').then(($body) => {
        if ($body.find('.clerk-signed-in').length > 0) {
          cy.log('User is signed in');
        } else {
          cy.log('User is not signed in');
        }
      });

      // Ensure page redirection is correct
      cy.url().should('not.include', '/sign-in');
    });
  });

  it('should load the page successfully', () => {
    // Check that the page title contains 'Services'
    cy.title().should('include', 'Services');
  });

  it('should contain "main functionalities"', () => {
    // Increase timeout to wait for the h2 element to load
    cy.get('h2')
      .should('be.visible')
      .and('include.text', 'main functionalities');
  });
});
