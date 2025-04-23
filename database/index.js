const mongoose = require("mongoose");

const ConnectionString =
  "mongodb://leoyoung790:j7Dr2Y1POY2HN6Eo@ac-rewlnkc-shard-00-00.zrfoxbz.mongodb.net:27017,ac-rewlnkc-shard-00-01.zrfoxbz.mongodb.net:27017,ac-rewlnkc-shard-00-02.zrfoxbz.mongodb.net:27017/?replicaSet=atlas-mnb3a4-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function ConnectToDatabase() {
  await mongoose.connect(ConnectionString);
  console.log("Database connected successfully");
}

module.exports = ConnectToDatabase;
