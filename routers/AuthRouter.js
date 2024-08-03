import express from "express";
import { UserController } from "../controllers/index.js";
import { registerValidation, loginValidation } from "../validations/index.js";
import checkAuth from "../utils/checkAuth.js";
import handleValidationErrors from "../utils/handleValidationErrors.js";

const router = express.Router();

router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
router.get("/me", checkAuth, UserController.getMe);

export default router;
