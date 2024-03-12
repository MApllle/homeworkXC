import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Row, Col, Form, Input, Button, Modal, message } from "antd";
import util from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:3000/")
      .then((res) => {
        console.log(res);
        navigate("/task");
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

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
          // 存在本地
          util.setStorage("userInfo", data);
          messageApi.open({
            type: "success",
            content: "登录成功！",
          });
          // 重定向到任务管理页面
          navigate("task");
        }
        console.log(res);
      })
      .catch(function (error) {
        messageApi.open({
          type: "error",
          content: "登录失败！",
        });
        console.log(error);
      });
  };

  const onRegister = () => {
    const data = form.getFieldsValue();
    axios
      .post("http://127.0.0.1:3000/user", data)
      .then((res) => {
        console.log(res);
        setRegisterOpen(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="新用户注册"
        centered
        open={registerOpen}
        onOk={() => onRegister()}
        onCancel={() => setRegisterOpen(false)}
        width={800}
        style={styles.container}
      >
        <Form
          name="inputRegister"
          form={form}
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: "请输入用户名！",
              },
            ]}
          >
            <Input placeholder="用户名一旦确定无法更改" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: "请输入密码！",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      <Row className="login" justify="center" align="middle">
        <Col span={8}>
          <h1>任务管理系统</h1>
          <Form className="login-form" initialValues={{ remember: true }}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "请输入用户名!" }]}
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
              rules={[{ required: true, message: "请输入密码!" }]}
            >
              <Input
                name="password"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="请输入密码"
                onChange={onInputChange}
              />
            </Form.Item>
            <Form.Item style={styles.container}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                onClick={onSubmit}
                style={styles.button}
              >
                登录
              </Button>
              <Button
                onClick={() => setRegisterOpen(true)}
                style={styles.button}
              >
                注册
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}

const styles = {
  container: {
    marginTop: 20,
    textAlign: "center",
  },
  button: {
    marginRight: 20,
  },
};
