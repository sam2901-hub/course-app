import { Router } from "express";
import courseModel from "../../models/courseModel.js";
import { errorResponse, successResponse } from "../../helper/serverResponse.js";
import { validateFields } from "../../helper/helpersFunction.js";

const testRouter=Router();

testRouter.post("/createTest",createTest)
testRouter.post("/updtaeTest/:id",updtaeTest)
testRouter.get("/deleteTest/:id",deleteTest)
testRouter.get("/getTests/:courseId/:lessonId",getTests)
// testRouter.get("/getTests/:courseId/:lessonId",getTest)
export default testRouter;

async function createTest(req,res){
    try{

        const{title,questions,lessonId}=req.body
        const reqFields = {
            title: "string",
            lessonId:"string"
          };
      
          const { errors, validatedFields } = validateFields(req.body, reqFields);
          if (errors.length > 0) {
            const errorsStr = errors.join(",");
            console.log("missing fields", errorsStr);
            errorResponse(res, 404, errorsStr);
            return;
          }
          const course =await courseModel.findOne({"lessons._id":lessonId})
          if(!course){
            errorResponse(res,404,"lesson not found")
          }
          const test = { title, questions };
          const lesson = course.lessons.id(lessonId);
          lesson.tests.push(test);
          await course.save();
          successResponse(res,"created",test)


    }catch(error){
        console.log(error);
        errorResponse(res, 500, "internal server error");
    }
}


async function updtaeTest(req,res){
    try{
        const { title, questions } = req.body;
        const course =await courseModel.findOne({'lessons.tests._id':req.params.id})
        if(!course){
          errorResponse(res,404,"lesson not found")
        }
        const lesson=await course.lessons.find(l=>l.tests.id(req.params.id))
        const test = lesson.tests.id(req.params.id);
        test.title = title || test.title;
        test.questions = questions || test.questions;
        await course.save();
        successResponse(res,"updated",test)

    }catch(error){
        console.log(error);
        errorResponse(res, 500, "internal server error");
    }

}

async function deleteTest(req,res){
    const { id } = req.params;
    try {
        const course = await courseModel.findOne({ 'lessons.tests._id': id });
        if (!course) {
            return res.status(404).json({ message: 'Test not found' });
        }
        const lesson = course.lessons.find(l => l.tests.id(id));
        lesson.tests.id(id).deleteOne({});
        await course.save();
        successResponse(res,"deleted",lesson)

}catch(error){
    console.log(error);
    errorResponse(res, 500, "internal server error");
}

}

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
  