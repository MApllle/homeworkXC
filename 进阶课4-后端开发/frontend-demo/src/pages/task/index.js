import React, { useEffect } from "react";
import utils from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import Topbar from "./topbar";
import Manage from "./manage";

export default function Task() {
  const navigate = useNavigate();
  useEffect(() => {
    const username = utils.getStorage("userInfo").username;
    if (!username) navigate("/");
  }, []);
  return (
    <div>
      <Topbar />
      <Manage />
    </div>
  );
}
