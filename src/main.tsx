import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

// Suppress unhandled promise rejections originating from third-party browser extensions
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (e) => {
    const msg = (e?.reason?.message || e?.reason || "") + "";
    if (
      msg.includes("Could not establish connection") ||
      msg.includes("Receiving end does not exist") ||
      msg.includes("message port closed")
    ) {
      e.preventDefault();
    }
  });
}

const router = getRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

// Register service worker non-blockingly after page load
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}
