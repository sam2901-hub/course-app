import { Router } from "express";
import { errorResponse, successResponse } from "../../helper/serverResponse.js";
import courseModel from "../../models/courseModel.js";
import path from "path";
import fs from "fs";

const lessonRouter = Router();

lessonRouter.get("/getlessons/:courseId", getlessons);
lessonRouter.get("/getlesson/:id", getlesson);
lessonRouter.get("/streamvideo/:videoUrl", streamvideo);
export default lessonRouter;

async function getlessons(req, res) {
  try {
    const { courseId } = req.params;

    const course = await courseModel.findById(courseId);
    if (!course) {
      return errorResponse(res, 404, "Course not found");
    }
    successResponse(res, "lessons", course.lessons);
  } catch (error) {
    console.error("Error creating lesson:", error.message);
    return errorResponse(res, 500, "Server error");
  }
}

async function getlesson(req, res) {
  try {
    const { id } = req.params;
    const course = await courseModel.findOne({ "lessons._id": id });

    if (!course) {
      return errorResponse(res, 404, "lesson not found");
    }

    const lesson = course.lessons.id(id);

    if (!lesson) {
      return errorResponse(res, 404, "Lesson not found");
    }

    return successResponse(res, "Lesson found", lesson);
  } catch (error) {
    console.error("Error retrieving lesson:", error.message);
    return errorResponse(res, 500, "Server error");
  }
}

async function streamvideo(req, res) {
  try {
    const videoUrl = req.params.videoUrl;
    const filePath = path.join("./stream", videoUrl);
    console.log(filePath);
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return errorResponse(res, 404, "Video not found.");
      }

      res.writeHead(200, {
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
      });

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    });
  } catch (error) {
    console.error("Error creating lesson:", error.message);
    return errorResponse(res, 500, "Server error");
  }
}
