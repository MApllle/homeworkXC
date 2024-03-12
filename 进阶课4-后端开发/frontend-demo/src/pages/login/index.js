import React, { useState } from "react";
import axios from "axios";
import "./index.css";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Row, Col, Form, Input, Button, Checkbox } from "antd";
import util from "../../utils/utils";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onInputChange = (e) => {
    let inputname = e.target.name;
    let inputvalue = e.target.value;

    if (inputname === "username") {
      setUsername(inputvalue);
    } else {
      setPassword(inputvalue);
    }
  };

  const onSubmit = () => {
    // 登录信息
    const data = {
      username: username,
      password: password,
    };

    // 表单验证
    axios
      .post(
        "http://127.0.0.1:3000/login",
        {
          username: data.username,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success === false) {
          alert("账户和密码输入有误!请重新输入！");
        } else {
          // localstorage存取
          util.setStorage("userInfo", data);
          console.log("登录成功");
          // 重定向到任务管理页面
          navigate("task");
        }
        console.log(res);
      })
      .catch(function (error) {
        // 处理错误情况
        console.log(error);
      });
  };

  return (
    <Row className="login" justify="center" align="middle">
      <Col span={8}>
        <h1>任务管理系统</h1>
        <Form className="login-form" initialValues={{ remember: true }}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名!!!" }]}
          >
            <Input
              name="username"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="请输入用户名"
              onChange={onInputChange}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码!!!" }]}
          >
            <Input
              name="password"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="请输入密码"
              onChange={onInputChange}
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住用户和密码</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              onClick={onSubmit}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
