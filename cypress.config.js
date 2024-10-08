import { clerkSetup } from '@clerk/testing/cypress'
import { defineConfig } from "cypress";
// import dotenv from 'dotenv';

// // Load environment variables from .env.test
// dotenv.config({ path: '.env.test' });
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return clerkSetup({config})
    },
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 10000, // Increase timeout to 10 seconds
    reporter: 'junit', // Use a reporter that outputs to a file
    reporterOptions: {
      mochaFile: 'cypress/results/results-[hash].xml', // Output results in this path
      toConsole: true // Optional: also output to the console
    },
    env: {
      NODE_ENV:  "test",
      // Include NODE_ENV in Cypress environment variables
      // NODE_ENV: process.env.NODE_ENV || 'test',
    }
  },
});
