import { Router } from "express";
import { errorResponse, successResponse } from "../../helper/serverResponse.js";
import courseModel from "../../models/courseModel.js";
import multer from "multer";
import path from "path";
import { validateFields } from "../../helper/helpersFunction.js";

const lessonRouter = Router();

lessonRouter.post("/createlesson", createlesson);
lessonRouter.post("/updatelesson/:id", updatelesson);
lessonRouter.get("/deletelesson/:id", deletelesson);
lessonRouter.get("/getlessons/:courseId", getlessons);
lessonRouter.get("/getlesson/:id", getlesson);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".mp4") {
      cb(null, path.join("./stream"));
    } else {
      cb(null, path.join("./studyMterial"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const uploadSessions = new Map();

lessonRouter.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return errorResponse(res, 400, "No file uploaded");
  }

  const fileUrl = req.file.filename;
  uploadSessions.set(req.body.sessionId, { fileUrl });

  return successResponse(res, "Uploaded successfully", { fileUrl });
});

export default lessonRouter;

async function createlesson(req, res) {
  const { sessionId, title, content, courseId } = req.body;

  // Retrieve the URL from the temporary store
  const sessionData = uploadSessions.get(sessionId);
  if (!sessionData || !sessionData.fileUrl) {
    return res.status(400).json({ message: "No uploaded file URL found" });
  }

  try {
    const course = await courseModel.findById(courseId);
    if (!course) {
      return errorResponse(res, 404, "Course not found");
    }

    const lesson = { title, content, videoUrl: sessionData.fileUrl };
    course.lessons.push(lesson);
    await course.save();

    // Clean up the session data
    uploadSessions.delete(sessionId);

    return successResponse(res, "Lesson created", lesson);
  } catch (error) {
    console.error("Error creating lesson:", error.message);
    return errorResponse(res, 500, "Server error");
  }
}

async function updatelesson(req, res) {
  const { id } = req.params;
  const { title, content, videoUrl } = req.body;
  try {
    const course = await courseModel.findOne({ "lessons._id": id });
    if (!course) {
      return errorResponse(res, 404, "lesson not found");
    }
    const lesson = course.lessons.id(id);
    // lesson.title = title || lesson.title;
    lesson.title = title;
    lesson.content = content;
    lesson.videoUrl = videoUrl;
    await course.save();
    return successResponse(res, "Lesson updated", lesson);
  } catch (error) {
    console.error("Error creating lesson:", error.message);
    return errorResponse(res, 500, "Server error");
  }
}

async function deletelesson(req, res) {
  const { id } = req.params;
  // const { title, content, videoUrl } = req.body;
  try {
    const course = await courseModel.findOne({ "lessons._id": id });
    if (!course) {
      return errorResponse(res, 404, "lesson not found");
    }
    const lesson = course.lessons.id(id).deleteOne({});
    await course.save();
    return successResponse(res, "Lesson deleted", course);
  } catch (error) {
    console.error("Error creating lesson:", error.message);
    return errorResponse(res, 500, "Server error");
  }
}

async function getlessons(req, res) {
  try {
    const { courseId } = req.params;

    const course = await courseModel.findById(courseId);
    if (!course) {
      return errorResponse(res, 404, "lesson not found");
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
      return errorResponse(res, 404, "Course not found");
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
