import { Router } from "express";
import courseModel from "../../models/courseModel.js";
import userModel from "../../models/userModel.js";
import { successResponse } from "../../helper/serverResponse.js";
import subscriptionModel from "../../models/subscriptionModel.js";

const analyticsRouter=Router();
 analyticsRouter.get("/getAdminAnalytics",getAdminAnalytics)

 export default analyticsRouter


 async function getAdminAnalytics(req,res){
    try{
      const totalCourses=await courseModel.countDocuments();
      const totalUsers= await userModel.countDocuments();
      const totalSubscriptions= await subscriptionModel.countDocuments()
      successResponse(res,"total",{"totalCourses":totalCourses,"totalUsers":totalUsers,})
        
    }catch(error){
      console.error(error.message);
      errorResponse(res, 500, { error: "Server error" });

    }
 }

  