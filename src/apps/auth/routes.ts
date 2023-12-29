import { Router } from "express";
import verifyJwtToken from "./middlewares/tokenVerification.js";
import { InputValidation } from "./middlewares/validation.js";
import {
  register_new_user,
  login,
  generate_password_reset_token,
  verifyAndRefreshToken,
  confirm_password_reset,
  sendMagicLink,
  confirmEmailVerification,
  get_user,
  update_user,
  delete_user,
  deactivate_user,
} from "./controllers/index.js";

/**
 * Creates an Express Router instance for handling authentication-related routes.
 */
export const authRouter = Router();

/**
 * Routes for user registration, login, and token management:
 */
authRouter
  .post(
    "/register",
    InputValidation.validateUserRegistration,
    register_new_user,
  )
  .post("/login", InputValidation.validateUserLogin, login)
  .post("/token/refresh", verifyAndRefreshToken)
  .post(
    "/password/reset/request",
    InputValidation.validateEmail,
    generate_password_reset_token,
  )
  .post(
    "/password/reset/confirm",
    InputValidation.validatePassword,
    confirm_password_reset,
  )
  .post("/email/verify/request", InputValidation.validateEmail, sendMagicLink)
  .get("/email/verify/confirm", confirmEmailVerification);

/**
 * Protected routes requiring a valid JWT token for authentication:
 */
authRouter
  .get("/user/:id", verifyJwtToken, get_user)
  .put(
    "/user/:id",
    InputValidation.validateUserUpdate,
    verifyJwtToken,
    update_user,
  )
  .get("/user/deactivate/:id", verifyJwtToken, deactivate_user)
  .delete("/user/:id", verifyJwtToken, delete_user);
