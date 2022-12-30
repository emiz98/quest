import Card from "../../../models/Card";
import db from "../../../db";
db();

export default async function handler(req, res) {
  const obj = {
    title: req.body.title,
    image: req.body.image,
    actID: req.body.actID,
    hints: req.body.hint,
  };
  const card = await Card.create(obj);
  res.status(200).json({ success: true, data: card });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb", // Set desired value here
    },
  },
};
