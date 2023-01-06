const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");

export default async function handler(req, res) {
  const modelUrl = new URL("./public/model.json", "http://localhost:3000");
  const model = await tf.loadLayersModel(modelUrl);
  //   const model = fs.readFileSync("./public/model.json");
  res.status(200).json({ success: true, data: "model" });
}
