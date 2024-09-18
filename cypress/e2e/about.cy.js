// // cypress/e2e/about.cy.js
// import { setupClerkTestingToken, addClerkCommands } from '@clerk/testing/cypress';

// // Add Clerk custom commands globally
// addClerkCommands({ Cypress, cy });

describe('About Page', () => {
  

  before(() => {
    cy.clearCookies();
  cy.clearLocalStorage();
    // // Set up Clerk testing token before all tests
    // setupClerkTestingToken();
      // Visit the /about page before running the tests
    cy.visit('/about');
    // cy.clerkSignIn({
    //   strategy: 'password',
    //   identifier: 'dbaichi@leoni.com', // Replace with test user credentials
    //   password: 'Espagne123@' 
    // }, { timeout: 10000 });

    // // Confirm user is signed in
    // cy.get('body').then(($body) => {
    //   if ($body.find('.clerk-signed-in').length > 0) {
    //     cy.log('User is signed in');
    //   } else {
    //     cy.log('User is not signed in');
    //   }
    // });
    

    // // Ensure page redirection is correct
    // cy.visit('/about');
    
    cy.url().should('not.include', '/sign-in');
 
    });
  
    it('should load the page successfully', () => {
      // Check that the page title is correct
      cy.title().should('include', 'About');
      
      
    });
  
    
  
    
  });
  