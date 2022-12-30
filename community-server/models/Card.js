import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const CardSchema = new Schema(
  {
    title: String,
    image: Buffer,
    hints: [{ type: String }],
    actID: { type: Schema.Types.ObjectId, ref: "Activity" },
  },
  { versionKey: false, timestamps: true }
);

module.exports = models.Card || model("Card", CardSchema);
