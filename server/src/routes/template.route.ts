import { Router } from "express";
import { create_new_template, get_all_templates } from "../controllers/template.js";

const template_router = Router();

template_router.get("/", get_all_templates);
template_router.post("/", create_new_template);

export default template_router;
