import React from "react";
import axios from "axios";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";

// 顶部导航栏:退出登录
export default function Topbar() {
  const navigate = useNavigate();
  const username = cookie.load("username");

  const logout = () => {
    axios
      .get("http://127.0.0.1:3000/logout")
      .then((res) => {
        console.log(res);
        cookie.remove("username");
        navigate("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div style={styles.container}>
      <span>您好，{username}，现在开始管理你的任务吧！</span>
      <Button type="primary" onClick={logout}>
        退出登录
      </Button>
    </div>
  );
}

const styles = {
  container: {
    margin: "10px",
    textAlign: "right",
    color:"white "
  },
};
