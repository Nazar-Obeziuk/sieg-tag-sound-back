import express from "express";
import multer from "multer";
import { BlogController } from "../controllers/index.js";
import { blogCreateValidation } from "../validations/index.js";
import handleValidationErrors from "../utils/handleValidationErrors.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const upload = multer();

const router = express.Router();

router.get("/", BlogController.getAll);
router.get("/lang/:lang", BlogController.getAllLang);
router.get("/:id", BlogController.getOne);
router.get("/:langID/:lang", BlogController.getOneLang);

router.post(
  "/",
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  blogCreateValidation,
  authenticateToken,
  BlogController.create
);

router.post(
  "/:langID",
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  blogCreateValidation,
  authenticateToken,
  BlogController.createLang
);


router.patch(
  "/:id",
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  authenticateToken,
  BlogController.update
);

router.delete(
  "/:id",
  authenticateToken,
  handleValidationErrors,
  BlogController.remove
);

export default router;
