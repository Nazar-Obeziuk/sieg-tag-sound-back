import express from "express";
import { PortfolioController } from "../controllers/index.js";
import { portfolioCreateValidation } from "../validations/index.js";
import handleValidationErrors from "../utils/handleValidationErrors.js";
import multer from "multer";

import { authenticateToken } from "../middleware/authMiddleware.js";

const upload = multer();

const router = express.Router();

router.get("/", PortfolioController.getAll);
router.get("/lang/:lang", PortfolioController.getAllLang);
router.get("/:id", PortfolioController.getOne);

router.post(
  "/",
  upload.fields([
    { name: "track_before", maxCount: 1 },
    { name: "track_after", maxCount: 1 },
  ]),
  portfolioCreateValidation,
  authenticateToken,
  PortfolioController.create
);

router.patch(
  "/:id",
  upload.fields([
    { name: "track_before", maxCount: 1 },
    { name: "track_after", maxCount: 1 },
  ]),
  portfolioCreateValidation,
  authenticateToken,
  PortfolioController.update
);
router.delete(
  "/:id",
  handleValidationErrors,
  authenticateToken,
  PortfolioController.remove
);

export default router;
