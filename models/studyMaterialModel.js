import mongoose, { model, Schema } from "mongoose";
const studyMaterialSchema = new Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
  title: { type: String, required: true },
  url: { type: String, required: true },
  // type: { type: String, enum: ['pdf', 'link'], required: true },
  createdAt: { type: Date, default: Date.now },
});
const studyMaterialModel = model("studyMaterial", studyMaterialSchema);
export default studyMaterialModel;
