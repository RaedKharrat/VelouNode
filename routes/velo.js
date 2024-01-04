import express from "express";
import multerConfig from "../middlewares/multer-config.js"

import {
  createvelo,
  getvelos,
  getvelo,
  updatevelo,
  deletevelo,
} from "../controllers/velo.js";
import { body } from "express-validator";

const router = express.Router();

const upload = multerConfig('image', {fileSize: 5 * 1024 * 1024})

// Routes for "Produits" resource
router.post("/velos", upload,body('type'), body('description'),body('prix'),body('disponible'), createvelo);
router.get("/veloss", getvelos);
router.put("/velos/:id", updatevelo);
router.delete("/velos/:id", deletevelo);
router.get("/velos/:_id",getvelo);


export default router;
