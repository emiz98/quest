import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const CardSchema = new Schema(
  {
    actID: String,
    title: String,
    image: String,
  },
  { versionKey: false, timestamps: true }
);

module.exports = models.Card || model("Card", CardSchema);
