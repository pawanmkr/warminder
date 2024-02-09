import { Router } from "express";
import upload from "../middlewares/file_upload.js";
import {
  handle_sheet_upload,
  handle_finding_sheets,
} from "../controllers/sheet.js";

const campaign_router = Router();

campaign_router.post("/", upload.single("sheet"), handle_sheet_upload);
campaign_router.get("/", handle_finding_sheets);

export default campaign_router;
