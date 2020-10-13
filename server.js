const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Hello<h1>");
});
PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
