import Activity from "../../../models/Activity";

export default async function handler(req, res) {
  const activity = await Activity.find();
  res.status(200).json({ success: true, data: activity });
}
