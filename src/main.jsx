import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import EstudoFlow from "./EstudoFlow.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EstudoFlow />
  </StrictMode>
);
