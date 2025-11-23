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
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on) {
      on("task", {
        resetDB: async () => {
          await resetDB();
          return null;
        },
      });
    },
  },
});
