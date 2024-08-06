import express from "express";
import { PortfolioController } from "../controllers/index.js";
import { portfolioCreateValidation } from "../validations/index.js";
import checkAuth from "../utils/checkAuth.js";
import handleValidationErrors from "../utils/handleValidationErrors.js";
import multer from "multer";
const upload = multer();


const router = express.Router();

router.get("/", PortfolioController.getAll);
router.get("/:id", PortfolioController.getOne);
router.post(
  "/",
  upload.fields([
    { name: 'track_before', maxCount: 1 },
    { name: 'track_after', maxCount: 1 },
  ]),
  portfolioCreateValidation,
  checkAuth,
  PortfolioController.create
);
router.patch(
  "/:id",
  upload.fields([
    { name: 'track_before', maxCount: 1 },
    { name: 'track_after', maxCount: 1 },
  ]),
  portfolioCreateValidation,
  checkAuth,
  PortfolioController.update
);
router.delete(
  "/:id",
  checkAuth,
  handleValidationErrors,
  PortfolioController.remove
);

export default router;
