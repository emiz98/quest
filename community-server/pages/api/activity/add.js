import db from "../../../db";
import Activity from "../../../models/Activity";
import nextConnect from "next-connect";
import multer from "multer";

db();
let fileName = "";
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads/activity",
    filename: (req, file, cb) => {
      fileName = Date.now() + file.originalname;
      cb(null, fileName);
    },
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array("image"));

apiRoute.post(async (req, res) => {
  const obj = {
    title: req.body.title,
    image: fileName,
  };
  const activity = await Activity.create(obj);
  res.status(200).json({ success: true, data: activity });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
