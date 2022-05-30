import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { Canvas } from "@react-three/fiber";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className="app">
      <Canvas shadows>
        <App />
      </Canvas>
    </div>
  </React.StrictMode>
);
