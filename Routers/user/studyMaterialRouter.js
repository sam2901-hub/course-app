import { Router } from "express";
import { errorResponse, successResponse } from "../../helper/serverResponse.js";
import studyMaterialModel from "../../models/studyMaterialModel.js";

const studyMaterialRouter = Router();

studyMaterialRouter.get("/getstudyMterial/:courseId", getstudyMterial);

export default studyMaterialRouter;

async function getstudyMterial(req, res) {
  try {
    const { courseId } = req.params;

    const materials = await studyMaterialModel.find({ courseId });
    return successResponse(res, "study material", materials);
  } catch (error) {
    console.error(error.message);
    return errorResponse(res, 500, "Server error");
  }
}
