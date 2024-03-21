import React from "react";
import { NavLink } from "react-router-dom";

export default function Page1() {
    return (
      <div className="container">
        <h1>Page1</h1>
        <NavLink to="/">Back to Home</NavLink>
        <NavLink to="/page2">Jump to Page2</NavLink>
      </div>
    );
  }