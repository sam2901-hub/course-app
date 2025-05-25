import { Router } from "express";
import subscriptionModel from "../../models/subscriptionModel.js";
import { errorResponse, successResponse } from "../../helper/serverResponse.js";

const subscriptionRouter=Router();
subscriptionRouter.get("/getSubscriptions",getSubscriptions)
export default subscriptionRouter

async function getSubscriptions(req,res){
    try {
        const subscribe = await subscriptionModel.find();
        successResponse(res, "all Subscriptions", subscribe);
      } catch (error) {
        console.log(error);
        errorResponse(res, 500, "internal server error");
      }

}



