import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  message,
  Radio,
  Space,
} from "antd";
import cookie from "react-cookies";
import { useNavigate } from "react-router-dom";
import "./index.css";
import util from "../../utils/utils";

export default function LoginForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [permission, setPermission] = useState("u2");
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setPermission(e.target.value);
  };

  useEffect(() => {
    console.log("useEffect");
    if (cookie.load("username")) {
      navigate("/page");
      console.log("已经登录");
    }
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
          //存在cookie
          cookie.save("username", data.username, {
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });
          console.log("登录返回信息",res.data.data);
          // 存在本地
          util.setStorage("userInfo", res.data.data);
          messageApi.open({
            type: "success",
            content: "登录成功！",
          });
          // 重定向到任务管理页面
          navigate("page");
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
          <Form.Item
            label="权限"
            name="permission"
            rules={[
              {
                required: true,
                message: "请选择用户权限!",
              },
            ]}
          >
            <Radio.Group
              onChange={onChange}
              value={permission}
              style={{ textAlign: "left" }}
            >
              <Space direction="vertical">
                <Radio value={"a"}>管理员</Radio>
                <Radio value={"u0"}>用户0（查看、编辑、增删）</Radio>
                <Radio value={"u1"}>用户1（查看、编辑）</Radio>
                <Radio value={"u2"}>用户2（仅查看）</Radio>
              </Space>
            </Radio.Group>
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
