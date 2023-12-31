import { Router } from "express";
import {
  add_new_email,
  get_all_the_companies,
  add_company,
} from "./controller.js";
import verify_jwt_token from "../../middlewares/jwt_middleware.js";

export const company_router = Router();

company_router
  .get("/list", get_all_the_companies)
  .post("/contribute", verify_jwt_token, add_company)
  .patch("/add/email/:company_id", verify_jwt_token, add_new_email);

// clear discrepancies in company's data using this route


// Internal Routes for various purposes like adding tags for companies
company_router.post("/tags");
