import { Router } from "express";
import { errorResponse, successResponse } from "../../helper/serverResponse.js";
import studyMaterialModel from "../../models/studyMaterialModel.js";
import { validateFields } from "../../helper/helpersFunction.js";

const studyMaterialRouter = Router();

studyMaterialRouter.post("/createStudyMaterial", createStudyMaterial);
studyMaterialRouter.get("/getstudyMterial/:courseId", getstudyMterial);
studyMaterialRouter.post("/updateStudyMterial/:id", updateStudyMterial);
studyMaterialRouter.get("/deletestudyMaterial/:id", deletestudyMaterial);

export default studyMaterialRouter;

async function createStudyMaterial(req, res) {
  try {
    const { courseId, title, url } = req.body;

    const reqFields = {
      title: "string",
      courseId: "string",
    };

    const { errors, validatedFields } = validateFields(req.body, reqFields);
    if (errors.length > 0) {
      const errorsStr = errors.join(",");
      console.log("missing fields", errorsStr);
      errorResponse(res, 404, errorsStr);
      return;
    }
    const studyMaterial = await studyMaterialModel.create({
      courseId,
      title,
      url,
    });

    return successResponse(res, " created", studyMaterial);
  } catch (error) {
    console.error(error.message);
    return errorResponse(res, 500, "Server error");
  }
}

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

async function updateStudyMterial(req, res) {
  try {
    const course = await studyMaterialModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    successResponse(res, "updated", course);
  } catch (error) {
    console.error("Error creating lesson:", error.message);
    return errorResponse(res, 500, "Server error");
  }
}

async function deletestudyMaterial(req, res) {
  try {
    const mterial = await studyMaterialModel.findById(req.params.id);
    if (!mterial) {
      errorResponse(res, 404, "course not found");
    }

    await studyMaterialModel.deleteOne({});

    successResponse(res, "deleted", mterial);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "internal server error");
  }
}
