import { defineConfig } from "cypress";
import { resetDB } from "./cypress/utils/reset-db";
import { clerkSetup } from "@clerk/testing/cypress";

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
      if (process.env.CI === "true") {
        console.log("🔧 Ejecutando en CI - Clerk Testing DESACTIVADO");
        return config;
      }

      
      const { clerkSetup } = require("@clerk/testing/cypress");
      return clerkSetup({ config });
    },
  },
});
