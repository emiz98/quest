import Card from "../../../models/Card";
// import fs from "fs";
import db from "../../../db";
db();

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  switch (method) {
    case "GET":
      try {
        const card = await Card.findById(id);
        if (!card) {
          res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: card });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "PUT":
      try {
        const card = await Card.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        // if (!activity) {
        //   res.status(400).json({ success: false, error: "card not found" });
        // }
        res.status(200).json({ success: true, data: card });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "DELETE":
      try {
        const card = await Card.findById(id);
        if (!card) {
          res.status(400).json({ success: false });
        }
        const deleteCard = await Card.deleteOne({ _id: id });
        res.status(200).json({ success: true, data: deleteCard });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
