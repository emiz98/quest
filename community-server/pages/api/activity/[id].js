import Activity from "../../../models/Activity";
import fs from "fs";
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
        const activity = await Activity.findById(id);
        if (!activity) {
          res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: activity });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "PUT":
      try {
        const activity = await Activity.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!activity) {
          res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: activity });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "DELETE":
      try {
        const activity = await Activity.findById(id);
        if (!activity) {
          res.status(400).json({ success: false });
        }
        const deleteActivity = await Activity.deleteOne({ _id: id });
        const filePath = "./public/uploads/activity/" + activity.image;
        fs.unlink(filePath, (error) => {
          if (error) {
            res.status(200).json({ success: true, error: error });
          } else {
            res.status(200).json({ success: true, data: deleteActivity });
          }
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
