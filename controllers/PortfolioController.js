import PortfolioModel from "../models/Portfolio.js";

import bucket from "../config/firebaseConfig.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import os from "os";
import { URL } from "url";
import fs from "fs";

async function uploadFileToFirebase(file) {
  const uniqueFilename = `${uuidv4()}-${file.originalname}`;
  const tempFilePath = path.join(os.tmpdir(), file.originalname);
  fs.writeFileSync(tempFilePath, file.buffer);

  await bucket.upload(tempFilePath, {
    destination: `portfolio/${uniqueFilename}`,
    metadata: {
      contentType: file.mimetype,
    },
  });

  fs.unlinkSync(tempFilePath);

  const fileRef = bucket.file(`portfolio/${uniqueFilename}`);
  const [url] = await fileRef.getSignedUrl({
    action: "read",
    expires: "03-01-2500",
  });

  return url;
}

async function deleteFileFromFirebase(imageUrl) {
  try {
    const url = new URL(imageUrl);
    const filePath = decodeURIComponent(url.pathname.split("/").pop());

    const file = bucket.file(`portfolio/${filePath}`);
    await file.delete();
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

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
    const { name, category, title, text } = req.body;

    const track_before = await uploadFileToFirebase(req.files.track_before[0]);
    const track_after = await uploadFileToFirebase(req.files.track_after[0]);

    const doc = new PortfolioModel({
      track_before,
      track_after,
      name,
      category,
      title,
      text,
    });

    const portfolio = await doc.save();

    res.status(201).json({
      message: "Портфоліо успішно створено",
    });
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
    const { name, category, title, text } = req.body;

    if (req.files && req.files.track_before && req.files.track_after) {
      const track_before = await uploadFileToFirebase(
        req.files.track_before[0]
      );
      const track_after = await uploadFileToFirebase(req.files.track_after[0]);

      const lastObj = await PortfolioModel.findById(portfolioId);

      await deleteFileFromFirebase(lastObj.track_before);
      await deleteFileFromFirebase(lastObj.track_after);

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
    } else {
      await PortfolioModel.updateOne(
        {
          _id: portfolioId,
        },
        {
          name,
          category,
          title,
          text,
        }
      );
    }

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

    const lastObj = await PortfolioModel.findById(portfolioId);

    await deleteFileFromFirebase(lastObj.track_before);
    await deleteFileFromFirebase(lastObj.track_after);

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
