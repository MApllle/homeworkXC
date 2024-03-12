import React, { useState, useEffect } from "react";
import axios from "axios";
import { Space, Table, Tag, Button, Modal, Form, Input, Select } from "antd";
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
const data = [
  {
    _id: "1",
    tname: "333",
    tdetail: "3333",
    tdone: false,
    uname: "hahaha",
  },
  {
    _id: "2",
    tname: "222",
    tdetail: "2222",
    tdone: true,
    uname: "hahaha",
  },
  {
    _id: "3",
    tname: "444",
    tdetail: "4444",
    tdone: false,
    uname: "hahaha",
  },
];
export default function Manage() {
  const [form] = Form.useForm();
  const [openModel, setOpenModel] = useState(false);
  const [openType, setopenType] = useState("add");
  const [taskList, setTaskList] = useState(data);
  const [loading, setLoading] = useState(false);

  const getTask = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:3000/task", {
        params: {
          uname: "hahaha",
        },
      })
      .then((res) => {
        console.log(res);
        setTaskList(res.data.data.result);
        console.log("result", res.data.data.result);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getTask();
  }, []);

  const onFinish = (values) => {
    console.log(values);
  };

  //提交表单
  const onSubmit = () => {
    const data = form.getFieldsValue();
    const { username: uname } = util.getStorage("userInfo");
    const newData = { ...data, uname };
    
    console.log("onSubmit",openType,"data is",newData);
    if (openType === "edit") {
      axios
        .put("http://127.0.0.1:3000/task", newData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
          getTask();
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (openType === "add") {
        console.log("detail");
      axios
        .post("http://127.0.0.1:3000/task", newData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
          getTask();
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
      .delete("http://127.0.0.1:3000/task", {
        params: {
          _id: record._id,
        },
      })
      .then((res) => {
        console.log(res);
        getTask();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //修改任务状况
  const onChangeDone = (record) => {
    axios
      .put("http://127.0.0.1:3000/task", {
        _id: record._id,
        tdone: !record.tdone,
      })
      .then((res) => {
        console.log(res);
        getTask();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //查看详情
  const onCheckDetail = (record) => {
    setopenType("detail");
    setOpenModel(true);
    form.setFieldsValue(record);
    console.log(record);
  };
  //编辑任务
  const onEdit = (record) => {
    setopenType("edit");
    setOpenModel(true);
    form.setFieldsValue(record);
  };
  //新增任务
    const onAdd = () => {
        setopenType("add");
        setOpenModel(true);
    };

  return (
    <>
      <Button type="primary" onClick={() => onAdd()}>
        新增任务
      </Button>
      <Modal
        title={
          openType === "add"
            ? "新增任务"
            : openType === "edit"
            ? "编辑任务"
            : openType === "detail"
            ? "查看任务"
            : "任务"
        }
        centered
        open={openModel}
        onOk={()=>onSubmit()}
        onCancel={() => setOpenModel(false)}
        width={1000}
      >
        <Form
          {...layout}
          name="inputTask"
          onFinish={onFinish}
          form={form}
          disabled={!openType === "detail"}
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item name="tname" label="任务名">
            <Input />
          </Form.Item>
          <Form.Item name="tdetail" label="任务详情">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="tdone" label="任务完成情况">
            <Select>
              <Select.Option value={true}>已完成</Select.Option>
              <Select.Option value={false}>未完成</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="_id" label="_id" style={{display:"none"}}>
            <span></span>
          </Form.Item>
        </Form>
      </Modal>
      <div style={styles.table_container}>
        <Table dataSource={taskList} rowKey="_id" size="middle">
          <Column ellipsis={true} title="任务名" dataIndex="tname" key="tname" />
          <Column ellipsis={true} title="任务摘要" dataIndex="tdetail" key="tdetail" />
          <Column ellipsis={true}
            title="任务状态"
            width={150}
            dataIndex="tdone"
            key="tdone"
            render={(tdone) =>
              tdone ? (
                <Tag color="green">已完成</Tag>
              ) : (
                <Tag color="red">未完成</Tag>
              )
            }
          />
          <Column
            title="操作"
            key="action"
            render={(_, record) => (
              <Space size="middle">
                <Button onClick={() => onCheckDetail(record)}>查看详情</Button>
                <Button onClick={() => onEdit(record)}>编辑任务</Button>
                <Button onClick={() => onChangeDone(record)}>
                  {record.tdone ? "取消" : "设置"}完成
                </Button>
                <Button onClick={() => onDelete(record)}>删除任务</Button>
              </Space>
            )}
          />
        </Table>
      </div>
    </>
  );
}

const styles = {
    table_container: {
        width:"90vw",
        margin:"auto",
        flex: 1,
        alginItems: "center",
    },
    };