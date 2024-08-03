import { body } from "express-validator";

export const loginValidation = [
  body("login", "Логін має бути мінімум 3 символа").isLength({ min: 3 }),
  body("password", "Пароль має бути мінімум 5 символів").isLength({ min: 5 }),
];

export const registerValidation = [
  body("login", "Невірний логін").isLength({ min: 3 }),
  body("password", "Пароль має бути мінімум 5 символів").isLength({ min: 5 }),
];
