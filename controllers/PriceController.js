import PriceModel from "../models/Price.js";

export const getAll = async (req, res) => {
  try {
    const prices = await PriceModel.find().exec();

    res.json(prices);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при завантаженні цін",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const prriceId = req.params.id;

    const doc = await PriceModel.findByIdAndUpdate(
      {
        _id: prriceId,
      },
      {
        returnDocument: "after",
      }
    ).exec();

    if (!doc) {
      return res.status(404).json({
        message: "Ціну не знайдено",
      });
    }

    res.json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при завантаженні цін",
    });
  }
};

export const create = async (req, res) => {
  try {
    const {
      track_mixmas,
      track_mix,
      track_mas,
      ep_mixmas,
      ep_mix,
      ep_mas,
      album_mixmas,
      album_mix,
      album_mas,
    } = req.body;
    const doc = new PriceModel({
      track_mixmas,
      track_mix,
      track_mas,
      ep_mixmas,
      ep_mix,
      ep_mas,
      album_mixmas,
      album_mix,
      album_mas,
    });

    const priceDoc = await doc.save();

    res.status(201).json({
      message: "Ціну успішно створено",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при створенні ціни",
    });
  }
};

export const update = async (req, res) => {
  try {
    const priceId = req.params.id;
    const {
      track_mixmas,
      track_mix,
      track_mas,
      ep_mixmas,
      ep_mix,
      ep_mas,
      album_mixmas,
      album_mix,
      album_mas,
    } = req.body;

    await PriceModel.updateOne(
      {
        _id: priceId,
      },
      {
        track_mixmas,
        track_mix,
        track_mas,
        ep_mixmas,
        ep_mix,
        ep_mas,
        album_mixmas,
        album_mix,
        album_mas,
      }
    );

    res.json({
      message: "Ціну успішно оновленно",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при оновленні ціни",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const priceId = req.params.id;

    const doc = await PriceModel.findByIdAndDelete({
      _id: priceId,
    }).exec();

    if (!doc) {
      return res.status(404).json({
        message: "Ціну не знайдено",
      });
    }

    res.json({
      message: "Ціну успішно видалено",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при видаленні ціни",
    });
  }
};
