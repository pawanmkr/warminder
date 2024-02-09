import { Router } from "express";
import {
  handle_sheet_upload,
  handle_finding_sheets,
} from "../controllers/sheet.js";
import upload from "../middlewares/file_upload.js";

const campaign_router = Router();

campaign_router.post(
  "/upload/sheet",
  upload.single("sheet"),
  handle_sheet_upload,
);
campaign_router.get("/list/sheet", handle_finding_sheets);

export default campaign_router;
