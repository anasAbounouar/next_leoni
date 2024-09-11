describe('Services Page', () => {
    beforeEach(() => {
      // Visit the /services page before each test to ensure the correct page
      cy.visit('/services');
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
  