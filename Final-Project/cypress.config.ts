/*
 * This file contains the configuration for Cypress, the end-to-end testing framework.
 * It defines settings for both component and E2E testing.
 */

import { clerkSetup } from "@clerk/testing/cypress";
import { defineConfig } from "cypress";
import { resetDB } from "./cypress/utils/reset-db";


/**
 * Cypress configuration object.
 * Configures dev server, spec patterns, base URL, and node events.
 */
export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  e2e: {
    specPattern: [
      "cypress/integration/**/*.cy.{js,jsx,ts,tsx}",
      "cypress/unit/backend/**/*.cy.{js,jsx,ts,tsx}",
      "cypress/unit/frontend/**/*.cy.{js,jsx,ts,tsx}",
    ],

    baseUrl: "http://localhost:3000",

    /**
     * Sets up Node events for Cypress.
     * Registers tasks like database reset and Clerk setup.
     *
     * @param on - Function to register event listeners.
     * @param config - The resolved Cypress configuration.
     * @returns The updated configuration.
     */
    setupNodeEvents(on, config) {
      on("task", {
        resetDB: async () => {
          await resetDB();
          return null;
        },
      });
      return clerkSetup({ config });
    },
  },
});
