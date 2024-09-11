// cypress/e2e/services/auditorsList/auditorsList.cy.js

describe('EmployeeData Component', () => {
    beforeEach(() => {
        // Visit the page where the EmployeeData component is rendered
        cy.visit('/services/auditorsList'); 
    });

    it('should display a loading spinner while fetching data', () => {
        // Ensure the spinner is visible when loading
        cy.get('.flex.justify-center.items-center.h-64').should('exist');
    });

    it('should display an error message if the data fetch fails', () => {
        // Simulate an API failure
        cy.intercept('GET', '/api/employees', { statusCode: 500 }).as('getEmployees');
        cy.reload(); // Reload the page to trigger the request
        cy.wait('@getEmployees');
        cy.get('.text-red-500').should('exist');
    });

    it('should display employee options in the select dropdown', () => {
        // Mock the employee data
        cy.intercept('GET', '/api/employees', {
            statusCode: 200,
            body: [
                
            ]
        }).as('getEmployees');

        cy.intercept('GET', '/api/employee/*', { statusCode: 200, body: { data: [] } }).as('getEmployeeData');
        cy.reload(); // Reload the page to trigger the request
        cy.wait('@getEmployees');
        cy.get('.basic-single').click(); // Open the select dropdown
    
    
    // Wait for the dropdown options to appear
    cy.wait(500); // Adjust the timeout as needed
// Log the entire dropdown menu HTML
cy.get('.basic-single').then($select => {
    cy.log($select.html()); // Logs the entire HTML of the select element
});
    // Verify all employee options
    cy.get('.select__option').contains('TOURIZ SIHAM (Head of Quality & SHE Management Morocco)').should('exist');
    cy.get('.select__option').contains('SEHLAOUI TARIK (Quality operations manager  WMABE)').should('exist');
    cy.get('.select__option').contains('Azzaoui KARIMA (Quality operations manager  WMAAS)').should('exist');
    // ... Add more as needed
    });

    it('should display employee data when an employee is selected', () => {
        // Mock the employee data
        cy.intercept('GET', '/api/employees', {
            statusCode: 200,
            body: [
                { id: 1, firstName: 'TOURIZ', lastName: 'SIHAM', jobTitle: 'Head of Quality & SHE Management Morocco' }
            ]
        }).as('getEmployees');

        cy.intercept('GET', '/api/employee/1', {
            statusCode: 200,
            body: {
                data: [
                    { index: 'column1', value: 'Sample Data' }
                ]
            }
        }).as('getEmployee1');
        cy.reload(); // Reload the page to trigger the request
        cy.wait('@getEmployees');
        cy.get('.basic-single').click(); // Open the select dropdown
        cy.get('.select__option').contains('TOURIZ SIHAM (Head of Quality & SHE Management Morocco)').click(); // Select the employee
        cy.get('table').should('exist');
        cy.get('td').contains('Sample Data').should('exist');
    });

    it('should handle file download button click', () => {
        // Intercept the download request
        cy.intercept('GET', '/api/download/excel', { statusCode: 200 }).as('downloadExcel');
        cy.get('button').contains('Download Excel file').click(); // Click the download button
        cy.wait('@downloadExcel'); // Wait for the download request
        cy.window().its('location.href').should('include', '/api/download/excel'); // Verify the URL
    });
});
