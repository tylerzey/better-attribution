import { defineConfig } from "vite";

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
});
