import React, { useState } from "react";
import axios from "axios";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Row, Col, Form, Input, Button, Checkbox } from "antd";
import util from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import Topbar from "./topbar";
import Manage from "./manage";

export default function Task() {
  return (
    <div>
      <Topbar />
      <Manage />
    </div>
  );
}
