import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { login, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      login,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._doc._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося зареєструватися",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await UserModel.findOne({ login: login });

    if (!user) {
      return res.status(404).json({
        message: "Користувача не знайдено",
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user._doc.passwordHash
    );

    if (!isValidPassword) {
      return res.status(403).json({
        message: "Неправильний логін або пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._doc._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося увійти",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Користувача не знайдено",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Немає доступу",
    });
  }
};
