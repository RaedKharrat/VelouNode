import express from "express";

import {
  createvelo,
  getvelos,
  getvelo,
  updatevelo,
  deletevelo,
} from "../controllers/velo.js";

const router = express.Router();

// Routes for "Produits" resource
router.post("/velos", createvelo);
router.get("/veloss", getvelos);
router.put("/velos/:id", getvelo);
router.delete("/velos/:id", updatevelo);
router.get("/velos/:_id",deletevelo);

export default router;
