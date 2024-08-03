import { body } from "express-validator";

export const promocodeCreateValidation = [
  body("promocode", "Введіть промокод").isLength({ min: 3 }).isString(),
];
