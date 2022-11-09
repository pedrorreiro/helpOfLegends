import React from "react";
import { useState } from "react";
import "../component/App.css";
import axios from "axios";
import { getCampeoes, getDadosCampeao } from "../tools";
import FreeWeek from "../component/FreeWeek";

const api_key = process.env.REACT_APP_API_KEY || "RGAPI-358bb2a2-afea-4842-aa31-699bb3b04fc8";

export default function Main() {

  return (
    <div className="component-app">
      <div className="content">

          <FreeWeek />

      </div>
    </div>
  );

}             