import { Router } from "express";
import courseRouter from "./courseRouter.js";
import lessonRouter from "./lessonRouter.js";
import studyMaterialRouter from "./studyMaterialRouter.js";
import userRouter from "./userRouter.js";
import analyticsRouter from "./analyticsRouter.js";
import subscriptionRouter from "../user/subscriptionRouter.js";
import testRouter from "./testRouter.js";
const adminRouter = Router();

adminRouter.use("/course", courseRouter);
adminRouter.use("/lessons", lessonRouter);
adminRouter.use("/studyMaterial", studyMaterialRouter);
adminRouter.use("/users",userRouter)
adminRouter.use("/analytics", analyticsRouter);
adminRouter.use("/subscription", subscriptionRouter);
adminRouter.use("/test", testRouter);
export default adminRouter;
