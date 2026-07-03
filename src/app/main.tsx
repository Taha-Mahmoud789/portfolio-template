import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { bootstrap } from "@/infrastructure";
import { App } from "./App";
import "@/styles/global.css";

const root = document.getElementById("root");

if (root) {
  bootstrap();

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
