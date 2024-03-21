import { NavLink } from "react-router-dom";
import React from "react";

export default function Home() {
  console.log("Home");
    return (
      <div className="container">
        <h1>This is Home ATESTLOADERSTRING</h1>
        <NavLink to="/page1">Jump to Page1</NavLink>
        <NavLink to="/page2">Jump to Page2</NavLink>
      </div>
    );
  }