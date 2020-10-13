const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { mongo } = require("./config.js");
const app = express();
mongoose
  .connect(mongo.URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) =>
    console.log("Error: Couldn't connect to MongoDB", err.message)
  );
app.use(bodyParser.json());
app.use("/api/todo", require("./routes/toDos"));

app.get("/", (req, res) => {
  res.send("<h1>Hello, Welcome to ToDo App<h1>");
});
PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
