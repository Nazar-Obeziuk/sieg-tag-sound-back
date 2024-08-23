import express from "express";
import { FullPricesController } from "../controllers/index.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.get("/", FullPricesController.getAll);
router.get("/:id", FullPricesController.getOne);
router.post("/", authenticateToken, FullPricesController.create);
router.patch("/:id", authenticateToken, FullPricesController.update);
router.delete("/:id", authenticateToken, FullPricesController.remove);

export default router;
