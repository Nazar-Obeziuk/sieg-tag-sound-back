import PortfolioModel from "../models/Portfolio.js";

export const getAll = async (req, res) => {
  try {
    const portfolios = await PortfolioModel.find().exec();

    res.json(portfolios);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при завантаженні портфоліо",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const portfolioId = req.params.id;

    const doc = await PortfolioModel.findByIdAndUpdate(
      {
        _id: portfolioId,
      },
      {
        returnDocument: "after",
      }
    ).exec();

    if (!doc) {
      return res.status(404).json({
        message: "Блог не знайдено",
      });
    }

    res.json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при завантаженні портфоліо",
    });
  }
};

export const create = async (req, res) => {
  try {
    const { track_before, track_after, name, category, title, text } = req.body;
    const doc = new PortfolioModel({
      track_before,
      track_after,
      name,
      category,
      title,
      text,
    });

    const portfolio = await doc.save();

    res.json(portfolio);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при створенні портфоліо",
    });
  }
};

export const update = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const { track_before, track_after, name, category, title, text } = req.body;

    await PortfolioModel.updateOne(
      {
        _id: portfolioId,
      },
      {
        track_before,
        track_after,
        name,
        category,
        title,
        text,
      }
    );

    res.json({
      message: "Портфоліо успішно оновленно",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при оновленні портфоліо",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const portfolioId = req.params.id;

    const doc = await PortfolioModel.findByIdAndDelete({
      _id: portfolioId,
    }).exec();

    if (!doc) {
      return res.status(404).json({
        message: "Портфоліо не знайдено",
      });
    }

    res.json({
      message: "Портфоліо успішно видалено",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при видаленні портфоліо",
    });
  }
};
