import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? "/hermes-learning-lab/" : "/",
  plugins: [react()],
  server: {
    host: "127.0.0.1",
  },
}));
