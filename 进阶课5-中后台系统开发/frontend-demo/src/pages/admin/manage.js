import React, { useState, useEffect } from "react";
import axios from "axios";
import { Space, Table, Button, Modal, Form, Input, Radio, message } from "antd";
import util from "../../utils/utils";

const { Column } = Table;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
export default function Manage() {
  const [form] = Form.useForm();
  const [openModel, setOpenModel] = useState(false);
  const [openType, setopenType] = useState("add");
  const [userList, setUserList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { permission } = util.getStorage("userInfo");
  console.log("permission", permission);

  const getUser = () => {
    axios
      .get("http://127.0.0.1:3000/user")
      .then((res) => {
        setUserList(
          res.data.data.result.map((item) => {
            item.password = "";
            return item;
          })
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const onFinish = (values) => {
    console.log("form", values);
  };

  //提交表单
  const onSubmit = () => {
    const data = form.getFieldsValue();
    const newData = { ...data };

    console.log("onSubmit", openType, "data is", newData);
    if (openType === "edit") {
      if (
        util.getStorage("userInfo").username === newData.username &&
        newData.permission !== "a"
      ) {
        messageApi.open({
          type: "error",
          content: "管理员不能修改自己的权限",
        });
        setOpenModel(false);
        return;
      }
      axios
        .put("http://127.0.0.1:3000/user", newData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
          getUser();
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (openType === "add") {
      console.log("detail");
      axios
        .post("http://127.0.0.1:3000/user", newData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
          getUser();
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    setOpenModel(false);
  };
  //删除任务
  const onDelete = (record) => {
    axios
      .delete("http://127.0.0.1:3000/user", {
        params: {
          username: record.username,
        },
      })
      .then((res) => {
        console.log(res);
        getUser();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //编辑用户信息
  const onEdit = (record) => {
    setopenType("edit");
    setOpenModel(true);
    form.setFieldsValue(record);
  };
  //新增用户
  const onAdd = () => {
    setopenType("add");
    form.resetFields();
    setOpenModel(true);
  };

  return (
    <div style={styles.container}>
      {contextHolder}
      <h1 style={styles.title}>权限管理</h1>
      <div style={styles.right}>
        <Button style={styles.add_btn} type="primary" onClick={() => onAdd()}>
          新增用户
        </Button>
      </div>

      <Modal
        title={
          openType === "edit"
            ? "编辑用户"
            : openType === "add"
            ? "新增用户"
            : "操作"
        }
        centered
        open={openModel}
        onOk={() => onSubmit()}
        onCancel={() => setOpenModel(false)}
        width={1000}
      >
        <Form
          {...layout}
          name="inputTask"
          onFinish={onFinish}
          form={form}
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item name="username" label="用户名">
            <Input disabled={openType === "add" ? false : true} />
          </Form.Item>
          <Form.Item
            name="password"
            label="修改密码"
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
            name="permission"
            label="用户权限"
            rules={[
              {
                required: true,
                message: "请选择用户权限!",
              },
            ]}
          >
            <Radio.Group value={permission} style={{ textAlign: "left" }}>
              <Space direction="vertical">
                <Radio value={"a"}>管理员</Radio>
                <Radio value={"u0"}>用户0（查看、编辑、增删）</Radio>
                <Radio value={"u1"}>用户1（查看、编辑）</Radio>
                <Radio value={"u2"}>用户2（仅查看）</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="_id" label="_id" style={{ display: "none" }}>
            <span></span>
          </Form.Item>
        </Form>
      </Modal>
      <div style={styles.table_container}>
        <Table
          dataSource={userList}
          rowKey="_id"
          size="middle"
          scroll={{
            x: 1000,
          }}
        >
          <Column
            ellipsis={true}
            title="用户名"
            dataIndex="username"
            key="username"
          />
          <Column
            ellipsis={true}
            title="用户权限组"
            dataIndex="permission"
            key="permission"
          />
          <Column
            title="操作"
            key="action"
            render={(_, record) => (
              <Space size="middle">
                <Button onClick={() => onEdit(record)}>编辑用户</Button>
                <Button onClick={() => onDelete(record)}>删除用户</Button>
              </Space>
            )}
          />
        </Table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    margin: "auto",
    flex: 1,
    alginItems: "center",
  },
  add_btn: {
    marginRight: "10vw",
    marginBottom: "10px",
  },
  table_container: {
    marginLeft: "20px",
    marginRight: "20px",
    margin: "auto 100",
    alginItems: "center",
  },
  title: {
    marginLeft: "3vw",
  },
  right: {
    textAlign: "right",
  },
};
