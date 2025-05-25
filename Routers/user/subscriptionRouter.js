import { Router } from "express";
import subscriptionModel from "../../models/subscriptionModel.js";
import { errorResponse, successResponse } from "../../helper/serverResponse.js";
const subscriptionRouter=Router();
subscriptionRouter.get("/getSubscriptions",getSubscriptions)
subscriptionRouter.get("/getSubscription/:id",getSubscription)
subscriptionRouter.post("/subscibeUser/:course",subscribeUser)
// subscriptionRouter.post("/updateSubscription/:id",updateSubscription)
subscriptionRouter.post("/unsubscibeUser",unsubscibeUser)
export default subscriptionRouter

async function getSubscriptions(req,res){
    try {
        const subscribe = await subscriptionModel.find({userId:res.locals.id});
        successResponse(res, "all Subscriptions", subscribe);
      } catch (error) {
        console.log(error);
        errorResponse(res, 500, "internal server error");
      }

}
async function getSubscription(req,res){
    try {
        const subscribe = await subscriptionModel.findOne({_id:req.params.id});
       
        
        successResponse(res, "Subscription", subscribe);
      } catch (error) {
        console.log(error);
        errorResponse(res, 500, "internal server error");
      }

}



async function subscribeUser(req, res) {
    try {
    
     const subscriptionDate= new Date()
     subscriptionDate.setFullYear(subscriptionDate.getFullYear());
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

       
        const subscriptions = await subscriptionModel.create({
            userId: res.locals.id,
            course:req.params.course,
            expiresAt: expirationDate,
            subscriptionDate:subscriptionDate
    });




        successResponse(res, "User subscribed successfully", subscriptions);
    } catch (error) {
        console.error(error);
        errorResponse(res, 500, "Internal server error");
    }
}



// async function updateSubscription(req,res){
//     try {
//         const subscribe = await subscriptionModel.findByIdAndUpdate(
//           req.params.id,
//           req.body,
//           { new: true }
//         );
//         successResponse(res, "updated", subscribe);
//       } catch (error) {
//         console.error(error.message);
//         errorResponse(res, 500, { error: "Server error" });
//       }
// }



async function unsubscibeUser(req,res) {
    const subscription = await subscriptionModel.findOne({userId:req.locals.id});
    
    if (!subscription) {
        return errorResponse(404, 'No subscription found' );
    }
    if (new Date() >= subscription.expiresAt) {
    await subscriptionModel.deleteOne({ _id: req.params.id });
    successResponse(res, 'Subscription expired and deleted successfully');
}
    res.json({ message: 'Unsubscribed successfully' });

     
}


