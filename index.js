import express from "express";
import dbconnect from "./db.js";
import config from "./config.js";
import publicRouter from "./Routers/public/publicRouter.js";
import usersRouter from "./Routers/user/userRouter.js";
import adminRouter from "./Routers/admin/adminRouter.js";
import { authMiddleware } from "./helper/helpersFunction.js";

const app = express()
const port=config.PORT;
  
app.use(express.json());


app.use("/api/public",publicRouter);
app.use("/api/admin",authMiddleware,adminRouter);
app.use("/api/users",authMiddleware,usersRouter);

app.use("*", (req, res) => {
    res.status(404).json({
      message: "not found",
    });
  });

dbconnect()
.then(()=>{
    app.listen(port,()=>{
        console.log(`server is listening at ${port}`);
    })
})
.catch((error)=>{
    console.log("Error Connecting Server ", error);
})
