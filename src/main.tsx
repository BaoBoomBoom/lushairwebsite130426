
  import { createRoot } from "react-dom/client";
  import { ClerkProvider } from "@clerk/clerk-react";
  import { SpeedInsights } from "@vercel/speed-insights/react";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  const PUBLISHABLE_KEY =
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
    "pk_test_b3JnYW5pYy1xdWFpbC0xMS5jbGVyay5hY2NvdW50cy5kZXYk";

  if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    console.warn(
      "VITE_CLERK_PUBLISHABLE_KEY is missing. Falling back to test Clerk key."
    );
  }

  createRoot(document.getElementById("root")!).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
      <SpeedInsights />
    </ClerkProvider>
  );
