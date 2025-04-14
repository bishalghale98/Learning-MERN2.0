import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("I am Bishal Ghale");
});

app.listen(3000, () => {
  console.log("server start in 3000");
});
