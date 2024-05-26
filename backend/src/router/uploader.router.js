import { Router } from "express";
import uploader from "../controllers/uploader.controller";

const router = Router();

router.route("/upload").post(uploader);

export default router;