import { Router } from "express";
import verify_jwt_token from "../../middlewares/jwt_middleware.js";
import {get_google_oauth_url} from "../../services/google.js";
import {handle_google_callback} from "./controllers/handle_google_auth.js";
import { InputValidation } from "./middlewares/validation.js";
import {
    verifyAndRefreshToken,
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
authRouter.post("/token/refresh", verifyAndRefreshToken);

/**
 * Protected routes requiring a valid JWT token for authentication:
 */
authRouter
    .get("/user/:id", verify_jwt_token, get_user)
    .put("/user/:id", InputValidation.validateUserUpdate, verify_jwt_token, update_user,)
    .get("/user/deactivate/:id", verify_jwt_token, deactivate_user)
    .delete("/user/:id", verify_jwt_token, delete_user);

// Google Auth
authRouter
    .get("/sign-in/google", (req, res) => {
        const authorizationUrl = get_google_oauth_url();res.redirect(authorizationUrl);
    })
    .get("/google/callback", handle_google_callback);

