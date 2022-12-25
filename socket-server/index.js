const express = require("express");
const app = express();
const server = require("http").createServer();
const io = require("socket.io")(server);

const cors = require("cors");
const bodyParser = require("body-parser");
require("colors");

app.use(cors());
app.use(bodyParser.json());
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Welcome to server");
});

app.get("/send/:id/:message", (req, res) => {
  console.log(req.params.id, req.params.message);
  res.send({ id: req.params.id, msg: req.params.message });
  //   const ioEmitter = req.app.get("socketIo");
  //   ioEmitter
  //     .to(req.params.id)
  //     .emit("message", { id: "999", msg: req.params.message });
  //   res.send("Sending message to " + req.params.id);
  //   console.log("Sending message to " + req.params.id);
});

io.on("connection", function (client) {
  console.log("client connect...", client.id);

  client.on("message", (data) => {
    console.log(data);
    io.emit("message", data);
  });

  client.on("connect", function () {});

  client.on("disconnect", function () {
    console.log("client disconnect...", client.id);
  });

  client.on("error", function (err) {
    console.log("received error from client:", client.id);
    console.log(err);
  });
});

const PORT = process.env.PORT || 8080;
const IP_GATEWAY = process.env.IP_GATEWAY || "localhost";

server.listen(PORT, IP_GATEWAY, () => {
  console.log(`Listening on PORT ${PORT}`.yellow);
  console.log(`IP Gateway (http://${IP_GATEWAY}:${PORT})`.red);
});
