import React from "react";
import axios from "axios";
import { Button } from "antd";
import util from "../../utils/utils";
import { useNavigate } from "react-router-dom";

// 顶部导航栏:退出登录
export default function Topbar() {
  const navigate = useNavigate();

  const logout = () => {
    axios
      .get("http://127.0.0.1:3000/logout")
      .then((res) => {
        console.log(res);
        util.clearStorage("userInfo");
        navigate("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div>
      <span>用户名</span>
      <Button type="primary" onClick={logout}>
        退出登录
      </Button>
    </div>
  );
}
