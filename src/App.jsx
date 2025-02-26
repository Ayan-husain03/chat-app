import React from "react";

import Room from "./pages/Room";

import { BrowserRouter, Route, Routes } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import PrivateRoutes from "./components/PrivateRoutes";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage/>} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Room />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
