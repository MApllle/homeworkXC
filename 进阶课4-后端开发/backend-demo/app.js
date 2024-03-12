const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

const dbName = 'TaskManager';

async function main() {

  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const userCollection = db.collection('user'); 
  const taskCollection = db.collection('task'); 
  userCollection.createIndex({ username: 1 }, { unique: true });
  const insertResult = await userCollection.insertOne({
    uid:0,
    username: 'TOM2',
    password: '男',
  });
  console.log('Inserted documents =>', insertResult);

  // the following code examples can be pasted here...

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());