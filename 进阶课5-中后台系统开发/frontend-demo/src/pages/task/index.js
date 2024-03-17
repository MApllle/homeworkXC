import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Manage from "./manage";
import cookie from "react-cookies";

export default function Task() {
  const navigate = useNavigate();
  useEffect(() => {
    const username = cookie.load("username");
    if (!username) navigate("/");
    console.log(cookie.load("connect.sid"));
  }, []);
  return (
    <div>
      <Manage />
    </div>
  );
}
