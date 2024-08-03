import { body } from "express-validator";

export const blogCreateValidation = [
  body("imageUrl", "Неправильне посилання на зображення").optional().isString(),
  body("descriptions", "Вкажіть опис блогу").optional().isArray(),
  body("blog_language", "Вкажіть мову блогу").isLength({ min: 2 }).isString(),
  body("title", "Введіть заголовок блогу").isLength({ min: 3 }).isString(),
  body("text", "Введіть текст блогу").isLength({ min: 5 }).isString(),
];
