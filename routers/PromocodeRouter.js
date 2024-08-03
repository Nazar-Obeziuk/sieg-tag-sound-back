import express from "express";
import { PromocodeController } from "../controllers/index.js";
import { promocodeCreateValidation } from "../validations/index.js";
import handleValidationErrors from "../utils/handleValidationErrors.js";
import checkAuth from "../utils/checkAuth.js";

const router = express.Router();

router.get("/", PromocodeController.getAll);
router.get("/:id", PromocodeController.getOne);
router.post(
  "/",
  promocodeCreateValidation,
  checkAuth,
  handleValidationErrors,
  PromocodeController.create
);
router.patch(
  "/:id",
  promocodeCreateValidation,
  checkAuth,
  handleValidationErrors,
  PromocodeController.update
);
router.delete(
  "/:id",
  checkAuth,
  handleValidationErrors,
  PromocodeController.remove
);

export default router;
