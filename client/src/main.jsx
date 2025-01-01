import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import router from "./Routes/router.jsx";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./Provider/AuthProvider.jsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
      <Toaster />
    </AuthProvider>
  </React.StrictMode>
);
