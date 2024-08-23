import FullPricesModel from "../models/FullPrices.js";

export const getAll = async (req, res) => {
  try {
    const prices = await FullPricesModel.find().exec();

    res.json(prices);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при завантаженні повноцінних цін",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const prriceId = req.params.id;

    const doc = await FullPricesModel.findByIdAndUpdate(
      {
        _id: prriceId,
      },
      {
        returnDocument: "after",
      }
    ).exec();

    if (!doc) {
      return res.status(404).json({
        message: "Повноцінну ціну не знайдено",
      });
    }

    res.json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при завантаженні повноцінних цін",
    });
  }
};

export const create = async (req, res) => {
  try {
    const { count, category, mixingAndMastering, mixing, mastering } = req.body;
    const doc = new FullPricesModel({
      count,
      category,
      mixingAndMastering,
      mixing,
      mastering,
    });

    const priceDoc = await doc.save();

    res.status(201).json({
      message: "Повноцінну ціну успішно створено",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при створенні повноцінних цін",
    });
  }
};

export const update = async (req, res) => {
  try {
    const priceId = req.params.id;
    const { count, category, mixingAndMastering, mixing, mastering } = req.body;

    await FullPricesModel.updateOne(
      {
        _id: priceId,
      },
      {
        count,
        category,
        mixingAndMastering,
        mixing,
        mastering,
      }
    );

    res.json({
      message: "Повноцінну ціну успішно оновленно",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при оновленні повноцінних цін",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const priceId = req.params.id;

    const doc = await FullPricesModel.findByIdAndDelete({
      _id: priceId,
    }).exec();

    if (!doc) {
      return res.status(404).json({
        message: "Повноцінну ціну не знайдено",
      });
    }

    res.json({
      message: "Повноцінну ціну успішно видалено",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при видаленні повноцінних цін",
    });
  }
};
