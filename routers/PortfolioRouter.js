import express from "express";
import { PortfolioController } from "../controllers/index.js";
import { portfolioCreateValidation } from "../validations/index.js";
import checkAuth from "../utils/checkAuth.js";
import handleValidationErrors from "../utils/handleValidationErrors.js";

const router = express.Router();

router.get("/", PortfolioController.getAll);
router.get("/:id", PortfolioController.getOne);
router.post(
  "/",
  portfolioCreateValidation,
  checkAuth,
  handleValidationErrors,
  PortfolioController.create
);
router.patch(
  "/:id",
  portfolioCreateValidation,
  checkAuth,
  handleValidationErrors,
  PortfolioController.update
);
router.delete(
  "/:id",
  checkAuth,
  handleValidationErrors,
  PortfolioController.remove
);

export default router;
