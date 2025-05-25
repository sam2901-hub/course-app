import { Router } from "express";
import { validateFields } from "../../helper/helpersFunction.js";
import courseModel from "../../models/courseModel.js";
import { errorResponse, successResponse } from "../../helper/serverResponse.js";

const courseRouter = Router();

courseRouter.post("/createCourse", createCourse);
courseRouter.post("/updateCourse/:id", updateCourse);
courseRouter.get("/deleteCourse/:id", deleteCourse);
courseRouter.get("/getCourse/:id", getCourse);
courseRouter.get("/getAllCourses", getAllCourses);

export default courseRouter;

async function createCourse(req, res) {
  try {
    const { title, description } = req.body;
    const reqFields = {
      title: "string",
      description: "string",
    };

    const { errors, validatedFields } = validateFields(req.body, reqFields);
    if (errors.length > 0) {
      const errorsStr = errors.join(",");
      console.log("missing fields", errorsStr);
      errorResponse(res, 404, errorsStr);
      return;
    }
    const course = await courseModel.create(req.body);

    successResponse(res, "created", course);
  } catch (error) {
    console.error(error.message);
    errorResponse(res, 500, { error: "Server error" });
  }
}

async function updateCourse(req, res) {
  try {
    const course = await courseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    successResponse(res, "updated", course);
  } catch (error) {
    console.error(error.message);
    errorResponse(res, 500, { error: "Server error" });
  }
}

async function deleteCourse(req, res) {
  try {
    const course = await courseModel.findById(req.params.id);
    if (!course) {
      errorResponse(res, 404, "course not found");
    }

    await courseModel.deleteOne({});

    successResponse(res, "deleted", course);
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

async function getAllCourses(req, res) {
  try {
    const course = await courseModel.find();
    successResponse(res, "all course", course);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "internal server error");
  }
}
