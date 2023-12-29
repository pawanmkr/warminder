import { Router } from "express";
import {
  update_company_details,
  get_all_the_companies,
  add_company,
} from "./controller.js";

export const company_router = Router();

company_router
  .get("/list", get_all_the_companies)
  .post("/contribute", add_company)
  .patch("/update/:id", update_company_details);
