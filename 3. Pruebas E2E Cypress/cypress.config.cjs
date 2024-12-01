const { defineConfig } = require("cypress");
const setupBrowser = require('./cypress/plugins/index.cjs');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      setupBrowser(on, config);
    },
    video: true,
    viewportWidth: 1920, // Ancho del viewport
    viewportHeight: 1080, // Alto del viewport
    env: {
      GHOST_VERSION: "5.96.0",
      GHOST_VERSION_OLD: "4.5",
      GHOST_PORT: "2368"
    }
  },
  trashAssetsBeforeRuns: true,
});