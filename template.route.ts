import { Router } from "express";

const template_router = Router();

template_router.get("/", get_all_templates);
template_router.post("/", create_new_template);

export default template_router;
