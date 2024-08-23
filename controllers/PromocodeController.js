import PromocodeModel from "../models/Promocode.js";

export const getAll = async (req, res) => {
  try {
    const promocodes = await PromocodeModel.find().exec();

    res.json(promocodes);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при завантаженні промокодів",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const promocodeId = req.params.id;

    const doc = await PromocodeModel.findByIdAndUpdate(
      {
        _id: promocodeId,
      },
      {
        returnDocument: "after",
      }
    ).exec();

    if (!doc) {
      return res.status(404).json({
        message: "Промокод не знайдено",
      });
    }

    res.json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при завантаженні промокоду",
    });
  }
};

export const create = async (req, res) => {
  try {
    const { promocode, discount, category } = req.body;
    const doc = new PromocodeModel({
      promocode,
      discount,
      category,
    });

    const promocodeDoc = await doc.save();

    res.status(201).json({
      message: "Промокод успішно створено",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при створенні промокоду",
    });
  }
};

export const update = async (req, res) => {
  try {
    const promocodeId = req.params.id;
    const { promocode, discount, category } = req.body;

    await PromocodeModel.updateOne(
      {
        _id: promocodeId,
      },
      {
        promocode,
        discount,
        category,
      }
    );

    res.json({
      message: "Промокод успішно оновленно",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при оновленні промокоду",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const promocodeId = req.params.id;

    const doc = await PromocodeModel.findByIdAndDelete({
      _id: promocodeId,
    }).exec();

    if (!doc) {
      return res.status(404).json({
        message: "Промокод не знайдено",
      });
    }

    res.json({
      message: "Промокод успішно видалено",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при видаленні промокоду",
    });
  }
};
