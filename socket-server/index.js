require("dotenv").config();
require("colors");

const tf = require("@tensorflow/tfjs");
require("tfjs-node-save");
const tfnode = require("@tensorflow/tfjs-node");
// const mobilenet = require("@tensorflow-models/mobilenet");

const fs = require("fs");
const JPEG = require("jpeg-js");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(cors());
app.use(bodyParser.json());
app.options("*", cors());

let clientCount = 0;

io.on("connection", function (client) {
  // if (clientCount === 0) {
  //   // Allow the client to connect
  //   clientCount++;
  // } else {
  //   // Disconnect the client
  //   client.disconnect();
  // }

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

app.get("/", (req, res) => {
  res.send("Welcome to quest socket server");
});

app.get("/classify", async (req, res) => {
  const buffer = fs.readFileSync("./carrot.jpg");
  const tfimage = tfnode.node.decodeImage(buffer);

  // const modelUrl = new URL("./model.json", "http://192.168.1.32");
  // const model = await mobilenet.load();
  // const model = await tf.loadLayersModel("file:///model/model.json");
  const model = await tf.loadLayersModel(
    "https://storage.googleapis.com/tfjs-models/tfjs/mnist_transfer_cnn_v1/model.json"
  );

  // const prediction = model.predict(tfimage);
  // const prediction = await model.classify(tfimage, 1);
  res.send(model.summary());
});

app.post("/send", (req, res) => {
  io.emit("message", { msg: req.body });
  res.send({ success: true, msg: req.body });
});

const PORT = process.env.PORT || 8080;
const IP_GATEWAY = process.env.IP_GATEWAY || "localhost";

server.listen(PORT, IP_GATEWAY, () => {
  console.log(`Listening on PORT ${PORT}`.yellow);
  console.log(`IP Gateway (http://${IP_GATEWAY}:${PORT})`.red);
});
