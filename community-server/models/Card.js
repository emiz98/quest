import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const CardSchema = new Schema(
  {
    actID: String,
    title: String,
    image: Buffer,
  },
  { versionKey: false, timestamps: true }
);

module.exports = models.Card || model("Card", CardSchema);
