import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    use: {
        headless: false,
        baseURL: "http://localhost:3000",
    },
    webServer: {
        url: "http://localhost:3000",
        command: "npm start",
    }
});