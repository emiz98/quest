import Card from "../../../models/Card";
import db from "../../../db";
db();

export default async function handler(req, res) {
  const card = await Card.find({ actID: req.query.actID }).sort({
    createdAt: "desc",
  });
  res.status(200).json({ success: true, data: card });
}
