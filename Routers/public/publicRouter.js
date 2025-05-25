import { Router } from "express";
import { errorResponse, successResponse } from "../../helper/serverResponse.js";
import {
  comparePassword,
  generateAccessToken,
  passwordbcrypt,
  validateFields,
} from "../../helper/helpersFunction.js";
import userModel from "../../models/userModel.js";

const publicRouter = Router();

publicRouter.post("/signup", signup);
publicRouter.post("/signin", signin);

export default publicRouter;

async function signup(req, res) {
  try {
    const { username, email, password, role } = req.body;
    const reqFields = {
      username: "string",
      email: "string",
      password: "string",
    };

    const { errors, validatedFields } = validateFields(req.body, reqFields);
    if (errors.length > 0) {
      const errorsStr = errors.join(",");
      console.log("missing fields", errorsStr);
      errorResponse(res, 404, errorsStr);
      return;
    }
    let userAvailable = await userModel.findOne({
      email: validatedFields.email,
    });
    if (userAvailable) {
      return errorResponse(res, 400, "user already registered");
    }

    const hashpassword = await passwordbcrypt(password);

    const newuser = await userModel.create({
      username,
      email,
      password: hashpassword,
      role,
    });
    successResponse(res, "created successfully", newuser);
  } catch (error) {
    console.error(error.message);
    errorResponse(res, 500, { error: "Server error" });
  }
}

async function signin(req, res) {
  try {
    const { email, password } = req.body;
    const reqFields = {
      email: "string",
      password: "string",
    };

    const { errors, validatedFields } = validateFields(req.body, reqFields);
    if (errors.length > 0) {
      const errorsStr = errors.join(",");
      console.log("missing fields", errorsStr);
      errorResponse(res, 404, errorsStr);
      return;
    }

    const user = await userModel.findOne({ email: validatedFields.email });
    if (!user) {
      errorResponse(res, 404, "email not found");
      return;
    }
    if (!comparePassword(password, user.password)) {
      errorResponse(res, 404, "invalid password");
      return;
    }

    const token = generateAccessToken(user.id, user.email, user.role);
    successResponse(res, "SignIn successfully", token);
  } catch (error) {
    console.error(error.message);
    errorResponse(res, 500, { error: "Server error" });
  }
}
