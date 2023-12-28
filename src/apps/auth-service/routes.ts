import { Router } from "express";
import verifyJwtToken from "./middlewares/tokenVerification.js";
import { InputValidation } from "./middlewares/validation.js";
import {
  registerNewUser,
  login,
  generatePasswordResetToken,
  verifyAndRefreshToken,
  confirmPasswordReset,
  sendMagicLink,
  confirmEmailVerification,
  getUser,
  updateUser,
  deleteUser,
  deactivateUser,
} from "./controllers/index.js";

export const authRouter = Router();

authRouter
  .post("/register", InputValidation.validateUserRegistration, registerNewUser)
  .post("/login", InputValidation.validateUserLogin, login)
  .post("/token/refresh", verifyAndRefreshToken)
  .post(
    "/password/reset/request",
    InputValidation.validateEmail,
    generatePasswordResetToken,
  )
  .post(
    "/password/reset/confirm",
    InputValidation.validatePassword,
    confirmPasswordReset,
  )
  .post("/email/verify/request", InputValidation.validateEmail, sendMagicLink)
  .get("/email/verify/confirm", confirmEmailVerification)

  // PROTECTED ROUTES
  .get("/user/:id", verifyJwtToken, getUser)
  .put(
    "/user/:id",
    InputValidation.validateUserUpdate,
    verifyJwtToken,
    updateUser,
  )
  .get("/user/deactivate/:id", verifyJwtToken, deactivateUser)
  .delete("/user/:id", verifyJwtToken, deleteUser);
