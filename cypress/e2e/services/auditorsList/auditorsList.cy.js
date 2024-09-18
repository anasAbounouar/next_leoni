import { setupClerkTestingToken, addClerkCommands } from '@clerk/testing/cypress';

// Add Clerk custom commands globally
addClerkCommands({ Cypress, cy });

describe('Auditors List E2E Tests', () => {
  
  // Set up Clerk testing token before all tests
  before(() => {
    setupClerkTestingToken();
  });

  // Run before each test
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  
   

    // Visit auditors list page and perform Clerk sign-in
    cy.visit('/services/auditorsList');
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
    cy.visit('/services/auditorsList');
    
    cy.url().should('not.include', '/sign-in');
  
  });

  // Test to verify Clerk is properly loaded
  it('should verify Clerk is loaded', () => {
    cy.clerkLoaded();
  });

  // Test to verify the dropdown visibility
  it('should display the dropdown', () => {
    cy.get('.select__control').should('be.visible').and('exist');
    cy.get('.select__placeholder').should('contain.text', 'Filtrer par employé');
  });

  // Test to log dropdown content after clicking
  it('should log dropdown content after clicking', () => {
    cy.get('.select__control').click();
    cy.get('.select__menu').should('be.visible');

    cy.get('.select__menu').then(($menu) => {
      cy.log($menu.html());
      cy.log($menu.text());

      $menu.find('.select__option').each((index, option) => {
        cy.log(`Option ${index}: ${option.innerText}`);
      });
    });

    cy.wait(2000); // Wait to inspect log output (optional)
  });

  // Test to load employee data upon dropdown selection
  it('should load the employee data on dropdown selection', () => {
    cy.get('.select__control').click();
    cy.get('.select__option').eq(1).click();

    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.get('table tbody tr').first().find('td').first().should('not.be.empty');
  });

  // Test to verify all employee data is displayed
  it('should display all employee data when "Tous les employées" is selected', () => {
    cy.get('.select__control').click();
    cy.get('.select__menu').contains('Tous les employées').click();

    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });
// Test to verify error message on failed data fetch
// Example assuming direct component or data handling
it('should handle error when data fetching fails', () => {
  // Mock the API call to return an error
  cy.intercept('GET', '/api/employees', {
    statusCode: 500,
    body: { message: 'Failed to fetch employee list' },
  }).as('fetchEmployeesFail');

  // Load the page and handle the error
  cy.visit('/services/auditorsList');
  cy.wait('@fetchEmployeesFail');
  
  // Assert that the error message is displayed
  cy.get('.text-red-500').should('contain.text', 'Failed to fetch employee list');
});
  // Test to verify the loading spinner during data fetch
  it('should show the loading spinner when data is loading', () => {
   
    cy.get('.animate-spinner-ease-spin').should('exist');
    // cy.wait('@fetchEmployees');
    cy.wait(2000)
    cy.get('.animate-spinner-ease-spin').should('not.exist');
  });



  
});
