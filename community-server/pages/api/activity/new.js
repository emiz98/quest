import Activity from "../../../models/Activity";
import db from "../../../db";
db();

export default async function handler(req, res) {
  const obj = {
    title: req.body.title,
    image: req.body.image,
  };
  const activity = await Activity.create(obj);
  res.status(200).json({ success: true, data: activity });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb", // Set desired value here
    },
  },
};
