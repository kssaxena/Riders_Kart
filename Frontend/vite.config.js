import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.publicKey": JSON.stringify(env.publicKey),
      "process.env.urlEndpoint": JSON.stringify(env.urlEndpoint),
      "process.env.publicVapidKey": JSON.stringify(env.publicVapidKey),
      "process.env.DomainUrl": JSON.stringify(env.DomainUrl),
      "process.env.razorpay_key_id": JSON.stringify(env.razorpay_key_id),
      "process.env.MAPS_URL": JSON.stringify(env.MAPS_URL),
    },
    plugins: [react()],
  };
});
