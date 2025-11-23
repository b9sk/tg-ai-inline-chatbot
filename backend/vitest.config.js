import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Enable ESM support
    // This is often not strictly necessary with "type": "module" in package.json
    // but can help resolve some edge cases.
    // You might need to adjust this based on your specific Node.js version and setup.
    // For most modern Node.js versions with "type": "module", Vitest should work out of the box.
    environment: 'node',
    globals: true,
  },
});