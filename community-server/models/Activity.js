import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const ActivitySchema = new Schema(
  {
    title: String,
    image: Buffer,
  },
  { versionKey: false, timestamps: true }
);

module.exports = models.Activity || model("Activity", ActivitySchema);
