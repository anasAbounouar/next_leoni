import { clerkSetup } from '@clerk/testing/cypress'
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return clerkSetup({config})
    },
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 10000, // Increase timeout to 10 seconds
  },
});
