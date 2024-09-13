// /cypress/e2e/services/auditorsList/auditorsList.cy.js 
describe('auditorsList  E2E Tests', () => {

    // Runs before each test
    beforeEach(() => {
      // Visit the page containing EmployeeData component
      cy.visit('/services/auditorsList'); // Adjust to the correct path
    });
    it('should show dropdown', () => {
        // Check if the dropdown is visible
        cy.get('.select__control').should('exist');
        
        // Check if the placeholder text 'Filtrer par employé' is present
        cy.get('.select__placeholder')
          .should('contain.text', 'Filtrer par employé');
      });
    
    it('should log dropdown content after clicking', () => {
        // Simulate opening the dropdown
        cy.get('.select__control').click();
        cy.wait(2000);
        
        // Log the content of the dropdown menu
        cy.get('.select__menu').then(($menu) => {
          // Log the HTML content of the dropdown
          cy.log($menu.html());
    
          // Log the text content to check the available options
          cy.log($menu.text());
    
          // Optionally, log each option individually
          $menu.find('.select__option').each((index, option) => {
            cy.log(`Option ${index}: ${option.innerText}`);
          });
        });
    
        // Wait for a moment to inspect the log output (optional)
        cy.wait(2000);  // Adjust the wait time if needed
      });
  
   
      it('should load the employee data on dropdown selection', () => {
        // Simulate opening the dropdown
        cy.get('.select__control').click();
      
        // Wait for the dropdown to be visible
        cy.get('.select__menu').should('be.visible'); 
      
        // Select "TOURIZ SIHAM (Head of Quality & SHE Management Morocco)" from the dropdown
        cy.get('.select__option').eq(1).click(); 
      
        // Wait for the table to update and verify the employee's data
        cy.get('table tbody tr').should('have.length.greaterThan', 0);
      
        // Optionally, check for specific table data related to the selected employee
        cy.get('table tbody tr')
          .first()
          .find('td')
          .first()
          .should('not.be.empty');
      });
  
    it('should display all employee data when "Tous les employées" is selected', () => {
      // Open dropdown
      cy.get('.select__control').click();
  
      // Select the "Tous les employées" option
      cy.get('.select__menu').contains('Tous les employées').click();
  
      // Verify that all employees' data is displayed
      cy.get('table tbody tr').should('have.length.greaterThan', 0);
    });
    
    // it('should trigger Excel download when the download button is clicked', () => {
    //   // Spy on the download request to confirm it's triggered
    //   cy.intercept('GET', '/api/download/excel').as('downloadExcel');
  
    //   // Click the "Download Excel" button
    //   cy.get('button').contains('Download Excel file').click();
  
    //   // Assert that the download request was made
    //   cy.wait('@downloadExcel').its('response.statusCode').should('eq', 200);
    // });
  
    it('should show the loading spinner when data is loading', () => {
      // Mock the API response to introduce a delay
      cy.intercept('/api/employees', (req) => {
        // Respond with a delay by using setTimeout
        setTimeout(() => {
          req.reply({ body: [] }); // Empty array as mock data
        }, 2000); // 2-second delay
      }).as('fetchEmployees');
    
      // Visit the page or trigger the API call
      cy.visit('/services/auditorsList'); // Ensure this triggers the API call
    
      // Check if the loading spinner is visible
      cy.get('.animate-spinner-ease-spin') // Adjust class names if needed
        .should('exist');
    
      // Wait for the mock response to complete
      cy.wait('@fetchEmployees');
    
      // Ensure that the loading spinner is no longer visible
      cy.get('.animate-spinner-ease-spin')
        .should('not.exist');
    });
    
  
    it('should show error message if data fetching fails', () => {
      // Mock the API to return a failure
      cy.intercept('GET', '/api/employees', {
        statusCode: 500,
        body: { message: 'Failed to fetch employee list' },
      }).as('fetchEmployeesFail');
  
      // Reload the page to trigger the API call
      cy.reload();
  
      // Wait for the API call to fail
      cy.wait('@fetchEmployeesFail');
  
      // Verify the error message is shown
      cy.get('.text-red-500').should('contain.text', 'Failed to fetch employee list');
    });
  });
  

