import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  e2e: {
    baseUrl: 'https://practice.expandtesting.com',
    specPattern: "**/*.feature",
    experimentalRunAllSpecs: true,
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
