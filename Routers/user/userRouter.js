import { Router } from "express";
import courseRouter from "./courseRouter.js";
import lessonRouter from "./lessonRouter.js";
import userModel from "../../models/userModel.js";
import { errorResponse, successResponse } from "../../helper/serverResponse.js";
import studyMaterialRouter from "./studyMaterialRouter.js";
import subscriptionRouter from "./subscriptionRouter.js";
import testRouter from "./testRouter.js";
const usersRouter = Router();
usersRouter.use("/profile", profile);
usersRouter.use("/course", courseRouter);
usersRouter.use("/lessons", lessonRouter);
usersRouter.use("/studyMaterial", studyMaterialRouter);
usersRouter.use("/subscription", subscriptionRouter);
usersRouter.use("/test", testRouter);
export default usersRouter;

async function profile(req, res) {
  try {
    const id = res.locals.id;

    if (!id) {
      errorResponse(res, 403, "user invalid");
      return;
    }
    console.log(id);

    let profile = await userModel
      .findById(id)
      .select({ role: 0, password: 0, __v: 0 });
    if (!profile) {
      errorResponse(res, 500, "profile not found");
      return;
    }

    successResponse(res, "success", profile);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "internal server error");
  }
}

// attendance
