import { clerkSetup } from "@clerk/testing/cypress";
import { defineConfig } from "cypress";
import { resetDB } from "./cypress/utils/reset-db";

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
