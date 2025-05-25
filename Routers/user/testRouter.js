import { Router } from "express";
import courseModel from "../../models/courseModel.js";
import { errorResponse, successResponse } from "../../helper/serverResponse.js";
import { validateFields } from "../../helper/helpersFunction.js";

const testRouter=Router();


testRouter.get("/getTests/:courseId/:lessonId",getTests)
// testRouter.get("/getTests/:courseId/:lessonId",getTest)
export default testRouter;



async function getTests(req, res) {
    try {
     
        const { courseId, lessonId } = req.params;
        const course = await courseModel.findById(courseId);
        if (!course) {
          return errorResponse(res, 404, "Course not found");
        }
    
    
        const lesson = course.lessons.id(lessonId); 
        if (!lesson) {
          return errorResponse(res, 404, "Lesson not found");
        }
        successResponse(res, "tests", lesson.tests);
      } catch (error) {
        console.error("Error fetching tests:", error.message);
        return errorResponse(res, 500, "Server error");
      }
    
  }
  
//   async function getTest(req, res) {
//     try {
//       const { id } = req.params;
//       const course = await courseModel.findOne({ "lessons._id": id });
  
//       if (!course) {
//         return errorResponse(res, 404, "Course not found");
//       }
  
//       const lesson = course.lessons.id(id);
  
//       if (!lesson) {
//         return errorResponse(res, 404, "Lesson not found");
//       }
  
//       return successResponse(res, "Lesson found", lesson);
//     } catch (error) {
//       console.error("Error retrieving lesson:", error.message);
//       return errorResponse(res, 500, "Server error");
//     }
//   }
  