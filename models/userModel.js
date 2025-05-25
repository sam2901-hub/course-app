import { model, Schema } from "mongoose";
import { type } from "os";
import { aborted } from "util";

const userSchema = new Schema({
  username: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  role: { type: String, require: true, default: "user" },
  createdAt: { type: Date, default: new Date() },
});
const userModel = new model("users", userSchema);
export default userModel;

aborted;
