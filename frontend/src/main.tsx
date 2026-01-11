import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { GoogleAuthProvider } from "./providers/GoogleAuthProvider";

createRoot(document.getElementById("root")!).render(
  <GoogleAuthProvider>
    <App />
  </GoogleAuthProvider>
);
