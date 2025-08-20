import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  env: {
    login_url: '/login',
    shadow_dom_url: '/shadowdom',
    registration_url: '/register',
    form_validation_url: '/form-validation',
    form_confirmation_url: '/form-confirmation',
    file_upload_url: '/upload',
    drag_and_drop_url: '/drag-and-drop',
    dialogs_url: '/js-dialogs',
    dashboard_url: '/secure',
    cart_url: '/cart',
    bookstore_url: '/bookstore'
  },
  e2e: {
    baseUrl: 'https://practice.expandtesting.com',
    specPattern: "**/*.feature",
    experimentalRunAllSpecs: true,
    video: true,
    screenshotOnRunFailure: true,
    testIsolation: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    chromeWebSecurity: false,
    includeShadowDom: true,
    
    async setupNodeEvents(
        on: Cypress.PluginEvents,
        config: Cypress.PluginConfigOptions
    ): Promise<Cypress.PluginConfigOptions> {
        await addCucumberPreprocessorPlugin(on, config);
        
        on(
          "file:preprocessor",
          createBundler({
            plugins: [createEsbuildPlugin(config)],
          })
        );
        
        on('task', {
        createTestFile({ size, filename }) {
          const fs = require('fs');
          const path = require('path');
          
          const content = 'x'.repeat(size * 1024); // size in KB
          const filePath = path.join(__dirname, 'cypress/fixtures', filename);
          
          fs.writeFileSync(filePath, content);
          return filePath;
          },
          
          cleanupTestFiles() {
          const fs = require('fs');
          const path = require('path');
          const fixturesDir = path.join(__dirname, 'cypress/fixtures');
          
          try {
            const files = fs.readdirSync(fixturesDir);
            files.forEach((file: string) => {
              if (file.startsWith('test-') || file.startsWith('temp-')) {
                fs.unlinkSync(path.join(fixturesDir, file));
              }
            });
            return 'Cleanup completed';
          } catch (error: unknown) {
              return error instanceof Error ? `Cleanup error: ${error.message}` : "An unexpected error occurred.";
            }
          }
        });

        // Browser launch configuration
        on('before:browser:launch', (browser = {
          name: "",
          family: "chromium",
          channel: "",
          displayName: "",
          version: "",
          majorVersion: "",
          path: "",
          isHeaded: false,
          isHeadless: false
        }, launchOptions) => {
          if (browser.family === 'chromium' && browser.name !== 'electron') {
            launchOptions.args.push('--start-fullscreen');
            launchOptions.args.push('--guest');
            return launchOptions;
          }
          if (browser.name === 'electron') {
            launchOptions.preferences.fullscreen = true;
            return launchOptions;
          }
        });
      return config;
    },

  },
});
