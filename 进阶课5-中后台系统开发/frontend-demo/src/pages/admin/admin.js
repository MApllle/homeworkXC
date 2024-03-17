import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Manage from "./manage";
import cookie from "react-cookies";
import util from "../../utils/utils";

export default function Admin() {
  const { permission } = util.getStorage("userInfo");

  const navigate = useNavigate();
  useEffect(() => {
    const username = cookie.load("username");
    if (!username) navigate("/");
  }, []);
  return (
    <div>
      {permission === "a" ? (
        <Manage />
      ) : (
        <div>无权访问该页面，请联系管理员！</div>
      )}
    </div>
  );
}
