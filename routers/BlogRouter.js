import express from "express";
import { BlogController } from "../controllers/index.js";
import { blogCreateValidation } from "../validations/index.js";
import checkAuth from "../utils/checkAuth.js";
import handleValidationErrors from "../utils/handleValidationErrors.js";

const router = express.Router();

router.get("/", BlogController.getAll);
router.get("/:id", BlogController.getOne);
router.post(
  "/",
  blogCreateValidation,
  checkAuth,
  handleValidationErrors,
  BlogController.create
);
router.patch("/:id", checkAuth, handleValidationErrors, BlogController.update);
router.delete("/:id", checkAuth, handleValidationErrors, BlogController.remove);

export default router;
