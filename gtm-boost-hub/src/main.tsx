import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import MSW worker
import { worker } from "./mocks/browser";

// Function to start MSW worker in development
async function enableMocking() {
  if (import.meta.env.DEV) {
    // Explicitly provide the service worker URL
    await worker.start({
      serviceWorker: {
        url: "/mockServiceWorker.js", // Vite serves public dir at root
      },
    });
    console.log("MSW worker started with explicit URL");
  }
}

// Start MSW and then render the app
enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
