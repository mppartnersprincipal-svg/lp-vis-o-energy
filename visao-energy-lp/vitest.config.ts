import { defineConfig } from "vitest/config";

// Vitest cobre a LP (lib/). Os testes do painel usam node:test: npm run test:painel
export default defineConfig({
  test: {
    include: ["lib/**/*.test.ts"],
  },
});
