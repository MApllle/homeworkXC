const express = require("express");
const session = require("express-session");
const { encrypt, decrypt } = require("./components/crypto");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const { MongoClient, ObjectId } = require("mongodb");

const cors = require("cors");

const app = express();
const port = 3000;

const router = express.Router();

app.use(bodyParser.json());
app.use(cors()); //使用cors中间件
const oneWeek = 1000 * 60 * 60 * 24 * 7;
app.use(
  session({
    secret: "the_abyss_looks_into_you",
    cookie: { maxAge: oneWeek },
    resave: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/TaskManager",
    }),
  })
);

//连接数据库 获取collection
const connectDB = async (collectionname) => {
  const url = "mongodb://127.0.0.1:27017";
  const dbName = "TaskManager";
  const client = new MongoClient(url);
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const Collection = db.collection(collectionname);
  return { Collection, client };
};

//去除空键值对
const removeEmpty = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
      delete obj[key];
    }
  });
  return obj;
};


app
  .route("/task")
  .get(async (req, res) => {
    //查询task
    const { Collection: taskCollection, client } = await connectDB("task");
    const { uname, tname, tdetail, tdone } = req.query;
    const query = removeEmpty({ uname, tname, tdetail, tdone });
    try {
      const result = await taskCollection.find(query).toArray();
      res.json({ success: true, data: { result } });
      client.close();
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e.message });
      return;
    }
  })
  .post(async (req, res) => {
    //新增task
    const { Collection: taskCollection, client } = await connectDB("task");
    //userCollection.createIndex({ username: 1 }, { unique: true });
    const { uname, tname, tdetail, tdone } = req.body;
    if (!uname) {
      res.json({ success: false, message: "需要字段uname!" });
      return;
    }
    try {
      const result = await taskCollection.insertOne({
        uname,
        tname,
        tdetail,
        tdone,
      });
      res.json({ success: true, data: { result } });
      client.close();
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e.message });
      return;
    }
  })
  .delete(async (req, res) => {
    //删除task
    const { Collection: taskCollection, client } = await connectDB("task");
    console.log(req.query);
    const { _id } = req.query;
    if (!_id) {
      res.status(500).json({ message: "需要字段_id!" });
      return;
    }
    const id = new ObjectId(_id);
    try {
      const result = await taskCollection.deleteOne({ _id: id });
      res.json({ success: true, data: { result } });
      client.close();
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e.message });
      return;
    }
  })
  .put(async (req, res) => {
    //修改task
    const { Collection: taskCollection, client } = await connectDB("task");
    const { uname, _id, tname, tdetail, tdone } = req.body;
    if (!_id) {
      res.status(500).json({ message: "需要字段_id!" });
      return;
    }
    //const id = ObjectId(_id);
    const update = removeEmpty({ uname, tname, tdetail, tdone });
    try {
      const result = await taskCollection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: update }
      );
      res.json({ success: true, data: { result } });
      client.close();
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e.message });
      return;
    }
  });

app
  .route("/user")
  .get(async (req, res) => {
    //查询user
    const { Collection: userCollection, client } = await connectDB("user");
    const { username } = req.query;
    const query = removeEmpty({ username });
    console.log("userquery", query);
    try {
      const result = await userCollection.find(query).toArray();
      res.json({ success: true, data: { result } });
      client.close();
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e.message });
      return;
    }
  })
  .post(async (req, res) => {
    //新增user,username唯一
    const { Collection: userCollection, client } = await connectDB("user");
    userCollection.createIndex({ username: 1 }, { unique: true });
    const { username, password } = req.body;
    try {
      const result = await userCollection.insertOne({
        username,
        password: encrypt(password),
      });
      res.json({ success: true, data: { result } });
      client.close();
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e.message });
      return;
    }
  })
  .put(async (req, res) => {
    //修改user,仅支持修改密码 密码长度校验前端完成
    const { Collection: userCollection, client } = await connectDB("user");
    const { username, password } = req.body;
    if (!username) {
      res.status(500).json({ message: "username is required!" });
      return;
    }
    try {
      const result = await userCollection.updateOne(
        { username },
        { $set: { password } }
      );
      res.json({ success: true, data: { result } });
      client.close();
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e.message });
      return;
    }
  })
  .delete(async (req, res) => {
    //删除user
    const { Collection: userCollection, client } = await connectDB("user");
    const { username } = req.query;
    if (!username) {
      res.status(500).json({ message: "username is required!" });
      return;
    }
    try {
      const result = await userCollection.deleteOne({ username });
      res.json({ success: true, data: { result } });
      client.close();
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e.message });
      return;
    }
  });

//登录
app.post("/login", async (req, res) => {
  const { Collection: userCollection, client } = await connectDB("user");
  const { username, password } = req.body;
  try {
    const pswcrypto = encrypt(password);
    const result = await userCollection
      .find({ username, password: pswcrypto })
      .toArray();
    console.log("login", result);
    if (result.length) {
      req.session.username = username;
      res.json({ success: true, message: "登录成功" });
    } else {
      res.status(500).json({ success: false, message: "用户名或密码错误" });
    }
    client.close();
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
    return;
  }
});

//登出；前端redirect到登录页
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: "登出成功" });
});

app.get("/", (req, res) => {
  if (req.session.userName) {
    //判断session 状态，如果有效，则返回主页，否则转到登录页面
    res.json({ success: true, message: "会话有效，跳过登录" });
  } else {
    res.status(500).json({ message: "会话无效，请登录" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
