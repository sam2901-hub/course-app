import mongoose, { model, Schema } from "mongoose";

const subscriptionSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  subscriptionDate: String,
  expiresAt:String,
});

const subscriptionModel= new model("subscription" ,subscriptionSchema)
export default subscriptionModel 