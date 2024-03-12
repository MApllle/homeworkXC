const express = require("express");
const session = require("express-session");
const { encrypt, decrypt } = require("./components/crypto");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");

const cors = require("cors");


const app = express();
const port = 3000;

const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");

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

//校验登录状态
// const passUrl = ["/login", "/register", "/404", "/loginout"];
// app.use(async (req,res,next) => {
//   if (!~passUrl.findIndex((item) => req.url === item)) {
//     if (!req.session.username) {
//       res.json({ success: false, message: "未登录" });
//       return;
//     }
//   }
//   console.log("req",req.session.username);
//   await next();
// });

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
    if(!uname){
      res.json({ success: false, message: "uname is required!" });
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
      res.status(500).json({message: "id is required!" });
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
      res.status(500).json({ message: "id is required!" });
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
app.get('/logout',(req,res) => {
  req.session.destroy();
  res.json({ success: true, message: "登出成功" });
});

//查询task
// app.get("/task", async (req, res) => {
//   const { taskCollection, client } = await connectDB("task");
//   const { uid, tname, tdetail, tdone } = req.query;
//   const query = removeEmpty({ uid, tname, tdetail, tdone });
//   try {
//     const result = await taskCollection.find(query).toArray();
//     res.json({ success: true, data: { result } });
//     client.close();
//   } catch (e) {
//     console.log(e);
//     res.json({ success: false, message: e.message });
//     return;
//   }
// });

// //删除task
// app.delete("/task", async (req, res) => {
//   const { taskCollection, client } = await connectDB("task");
//   const { uid, _id } = req.query;
//   const query = removeEmpty({ uid, _id });
//   try {
//     const result = await taskCollection.deleteOne(query);
//     res.json({ success: true, data: { result } });
//     client.close();
//   } catch (e) {
//     console.log(e);
//     res.json({ success: false, message: e.message });
//     return;
//   }
// });

// //新增task
// app.post("/task", async (req, res) => {
//   const { taskCollection, client } = await connectDB("task");
//   //userCollection.createIndex({ username: 1 }, { unique: true });
//   const { uid, tname, tdetail, tdone } = req.body;
//   try {
//     const result = await taskCollection.insertOne({
//       uid,
//       tname,
//       tdetail,
//       tdone,
//     });
//     res.json({ success: true, data: { result } });
//     client.close();
//   } catch (e) {
//     console.log(e);
//     res.json({ success: false, message: e.message });
//     return;
//   }
// });

// //修改task
// app.put("/task", async (req, res) => {
//   const { taskCollection, client } = await connectDB("task");
//   const { uid, _id, tname, tdetail, tdone } = req.body;
//   if (!_id) {
//     res.json({ success: false, message: "id is required!" });
//     return;
//   }
//   const query = removeEmpty({ _id });
//   const update = removeEmpty({ uid, tname, tdetail, tdone });
//   try {
//     const result = await taskCollection.updateOne(query, { $set: update });
//     res.json({ success: true, data: { result } });
//     client.close();
//   } catch (e) {
//     console.log(e);
//     res.json({ success: false, message: e.message });
//     return;
//   }
// });

// const calMD5 = (data) => {
//   return crypto.createHash("md5").update(data).digest("hex");
// };

// const saveImage = (data, filaName) => {
//   const outputDir = path.resolve(__dirname, "./output");
//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir);
//   }
//   const filePath = path.resolve(outputDir, filaName);
//   if (fs.existsSync(filePath)) {
//     console.log(`File ${filaName} already exists`);
//     return;
//   }
//   fs.writeFileSync(filePath, data);
// };

// const createErrorResponse = (message) => {
//   return { success: false, message };
// };

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.post("/uploadimage", async (req, res) => {
//   res.setHeader("Content-Type", "application/json");
//   const { url } = req.body;
//   if (!url) {
//     res.status(400).json(createErrorResponse("URL is required!"));
//     return;
//   }
//   try {
//     const parseUrl = new URL(url);
//   } catch (e) {
//     res.status(400).json(createErrorResponse("Invalid URL"));
//     return;
//   }
//   try {
//     const image = await axios.get(url, { responseType: "arraybuffer" });
//     const ext = url.split("?")[0].split(".").pop(); //$或者?都需要判断
//     const md5 = calMD5(image.data);
//     const fileName = `${md5}.${ext}`;
//     console.log(fileName);
//     saveImage(image.data, fileName);

//     res.json({ success: true, data: { md5, fileName } });
//   } catch (e) {
//     console.log(e);
//     res
//       .status(500)
//       .json(createErrorResponse(`Error fetching image from ${url}`));
//     return;
//   }
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
