import { Router, Request, Response } from "express";
import verify_jwt_token from "../../middlewares/jwt_middleware.js";
// import { get_google_oauth_url } from "../../services/google/google.js";
import { handle_google_oauth } from "./controllers/handle_google_auth.js";
import { InputValidation } from "./middlewares/validation.js";
import {
    verifyAndRefreshToken,
    get_user,
    update_user,
    delete_user,
    deactivate_user,
} from "./controllers/index.js";
import { send_cold_mail } from "../../controllers/mail.js";

export const authRouter = Router();

authRouter.get("/health", async (req: Request, res: Response) => {
    res.send("OK");
});

authRouter.post("/token/refresh", verifyAndRefreshToken);

authRouter
    .get("/user", verify_jwt_token, get_user)
    .put("/user/:id", InputValidation.validateUserUpdate, verify_jwt_token, update_user,)
    .get("/user/deactivate/:id", verify_jwt_token, deactivate_user)
    .delete("/user/:id", verify_jwt_token, delete_user);

authRouter
    .post("/sign-in/google", handle_google_oauth);

export const mail_router = Router();

mail_router.post("/send", send_cold_mail);
