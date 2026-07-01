import express from "express";
import { recommendDoctors } from "../controllers/aiController.js";

const router = express.Router();

router.post("/recommend", recommendDoctors);

export default router;