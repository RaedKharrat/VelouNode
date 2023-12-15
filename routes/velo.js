import express from "express";
import upload from "../middlewares/multer-config.js"

import {
  createvelo,
  getvelos,
  getvelo,
  updatevelo,
  deletevelo,
} from "../controllers/velo.js";

const router = express.Router();

// Routes for "Produits" resource
router.post("/velos", upload, createvelo);
router.get("/veloss", getvelos);
router.put("/velos/:id", getvelo);
router.delete("/velos/:id", updatevelo);
router.get("/velos/:_id",deletevelo);

export default router;
