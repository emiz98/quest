import Activity from "../../../models/Activity";
import db from "../../../db";
db();

export default async function handler(req, res) {
  const activity = await Activity.find().sort({ createdAt: "desc" });
  res.status(200).json({ success: true, data: activity });
}
