import { body } from "express-validator";

export const portfolioCreateValidation = [
  body("track_before", "Неправильне посилання на файл до")
    .optional()
    .isString(),
  body("track_after", "Неправильне посилання на файл після")
    .optional()
    .isString(),
  body("name", "Введіть опис портфоліо").isLength({ min: 3 }).isString(),
  body("category", "Введіть категорію портфоліо")
    .isLength({ min: 3 })
    .isString(),
  body("title", "Введіть заголовок портфоліо").isLength({ min: 3 }).isString(),
  body("text", "Введіть текст портфоліо").isLength({ min: 5 }).isString(),
];
