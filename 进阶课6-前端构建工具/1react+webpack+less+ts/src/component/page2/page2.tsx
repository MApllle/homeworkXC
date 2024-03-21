import React from "react";
import { NavLink } from "react-router-dom";

export default function Page2() {
    return (
      <div className="container">
        <h1>Page2</h1>
        <NavLink to="/">Back to Home</NavLink>
        <NavLink to="/page1">Jump to Page1</NavLink>
      </div>
    );
  }