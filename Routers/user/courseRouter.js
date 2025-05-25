import { Router } from "express";
import courseModel from "../../models/courseModel.js";
import { errorResponse, successResponse } from "../../helper/serverResponse.js";

const courseRouter = Router();
courseRouter.get("/getAllCourses", getAllCourses);
courseRouter.get("/getCourse/:id", getCourse);
export default courseRouter;

async function getAllCourses(req, res) {
  try {
    const course = await courseModel.find();
    successResponse(res, "all course", course);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "internal server error");
  }
}

async function getCourse(req, res) {
  try {
    const course = await courseModel.findById(req.params.id);
    successResponse(res, "course", course);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "internal server error");
  }
}
