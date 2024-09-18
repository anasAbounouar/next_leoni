// cypress/e2e/about.cy.js
import { setupClerkTestingToken, addClerkCommands } from '@clerk/testing/cypress';

// Add Clerk custom commands globally
addClerkCommands({ Cypress, cy });

describe('About Page', () => {
  before(() => {
    // Set up Clerk testing token before all tests
    setupClerkTestingToken();

    // Ensure you visit the correct origin
    cy.origin('http://localhost:3000', () => { // Adjust the origin if necessary
      // Visit the /about page
      cy.visit('/about');

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
    // Check that the page title is correct
    cy.title().should('include', 'About');
  });
});
