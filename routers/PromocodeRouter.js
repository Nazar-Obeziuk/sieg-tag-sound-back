import express from "express";
import { PromocodeController } from "../controllers/index.js";
import { promocodeCreateValidation } from "../validations/index.js";
import handleValidationErrors from "../utils/handleValidationErrors.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", PromocodeController.getAll);
router.get("/:id", PromocodeController.getOne);
router.post("/", authenticateToken, PromocodeController.create);
router.patch(
  "/:id",
  promocodeCreateValidation,
  authenticateToken,
  handleValidationErrors,
  PromocodeController.update
);
router.delete(
  "/:id",
  authenticateToken,
  handleValidationErrors,
  PromocodeController.remove
);

export default router;
