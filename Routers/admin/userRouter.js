import { Router } from "express";
import userModel from "../../models/userModel.js";
import { successResponse } from "../../helper/serverResponse.js";

const userRouter = Router();

userRouter.get("/getAllUser", getAllUser);

export default userRouter;

async function getAllUser(req, res) {
  try {
    const users=await userModel.find()
    return successResponse(res,"all users",users)
  } catch (error) {
    console.error(error.message);
    errorResponse(res, 500, { error: "Server error" });
  }
}
