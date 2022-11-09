import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "../Pages/Main";
import Header from "./Header";
import Invocador from "../Pages/Invocador";

export default function App() {
  
  return(
    <BrowserRouter>

      <Header/>      

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/:busca" element={<Invocador />} />
      </Routes>
    </BrowserRouter>
  )

}             