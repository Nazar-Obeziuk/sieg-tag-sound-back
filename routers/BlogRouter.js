import express from "express";
import multer from "multer";
import { BlogController } from "../controllers/index.js";
import { blogCreateValidation } from "../validations/index.js";
import checkAuth from "../utils/checkAuth.js";
import handleValidationErrors from "../utils/handleValidationErrors.js";

const upload = multer();

const router = express.Router();

router.get("/", BlogController.getAll);
router.get("/:id", BlogController.getOne);

router.post(
  "/",
  upload.fields([
    { name: 'image_url', maxCount: 1 },
  ]),
  blogCreateValidation,
  checkAuth,
  BlogController.create
);

router.patch(
  "/:id",
  upload.fields([
    { name: 'image_url', maxCount: 1 },
  ]),
  checkAuth,
  BlogController.update);

router.delete("/:id", checkAuth, handleValidationErrors, BlogController.remove);

export default router;
