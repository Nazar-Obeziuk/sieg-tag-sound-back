import express from "express";
import { PriceController } from "../controllers/index.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", PriceController.getAll);
router.get("/:id", PriceController.getOne);
router.post("/", authenticateToken, PriceController.create);
router.patch("/:id", authenticateToken, PriceController.update);
router.delete("/:id", authenticateToken, PriceController.remove);

export default router;
