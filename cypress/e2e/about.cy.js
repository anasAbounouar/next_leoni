// cypress/integration/about_spec.js
describe('About Page', () => {
    before(() => {
      // Visit the /about page before running the tests
      cy.visit('/about');
    });
  
    it('should load the page successfully', () => {
      // Check that the page title is correct
      cy.title().should('include', 'About');
      
      
    });
  
    
  
    
  });
  