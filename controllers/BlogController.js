import { v4 as uuidv4 } from "uuid";
import path from "path";
import os from "os";
import { URL } from "url";
import fs from "fs";

import BlogModel from "../models/Blog.js";
import bucket from "../config/firebaseConfig.js";

async function uploadImageToFirebase(file) {
  const uniqueFilename = `${uuidv4()}-${file.originalname}`;
  const tempFilePath = path.join(os.tmpdir(), file.originalname);
  fs.writeFileSync(tempFilePath, file.buffer);

  await bucket.upload(tempFilePath, {
    destination: `blog/${uniqueFilename}`,
    metadata: {
      contentType: file.mimetype,
    },
  });

  fs.unlinkSync(tempFilePath);

  const fileRef = bucket.file(`blog/${uniqueFilename}`);
  const [url] = await fileRef.getSignedUrl({
    action: "read",
    expires: "03-01-2500",
  });

  return url;
}

async function deleteImageFromFirebase(imageUrl) {
  try {
    const url = new URL(imageUrl);
    const filePath = decodeURIComponent(url.pathname.split("/").pop());

    const file = bucket.file(`blog/${filePath}`);
    await file.delete();
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

export const getAll = async (req, res) => {
  try {
    const blogs = await BlogModel.find().exec();

    res.json(blogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при завантаженні блогів",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const blogId = req.params.id;

    const doc = await BlogModel.findByIdAndUpdate(
      {
        _id: blogId,
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
      message: "Помилка при завантаженні блогу",
    });
  }
};

export const create = async (req, res) => {
  try {
    const { descriptions, blog_language, title, text } = req.body;
    const imageUrl = await uploadImageToFirebase(req.files.image_url[0]);
    let parseDescriptions = await JSON.parse(descriptions);

    const doc = new BlogModel({
      image_url: imageUrl,
      descriptions: parseDescriptions,
      blog_language,
      title,
      text,
    });

    console.log(doc);

    const blog = await doc.save();

    res.status(201).json({
      message: "Блог успішно створено",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при створенні блогу",
    });
  }
};

export const update = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { descriptions, blog_language, title, text } = req.body;
    let parseDescriptions = await JSON.parse(descriptions);

    if (req.files && req.files.image_url) {
      const imageUrl = await uploadImageToFirebase(req.files.image_url[0]);
      const lastObj = await BlogModel.findById(blogId);
      await deleteImageFromFirebase(lastObj.image_url);

      await BlogModel.updateOne(
        {
          _id: blogId,
        },
        {
          image_url: imageUrl,
          descriptions: parseDescriptions,
          blog_language,
          title,
          text,
        }
      );
    } else {
      await BlogModel.updateOne(
        {
          _id: blogId,
        },
        {
          descriptions: parseDescriptions,
          blog_language,
          title,
          text,
        }
      );
    }

    res.json({
      message: "Блог успішно оновленно",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при оновленні блогу",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const blogId = req.params.id;

    const lastObj = await BlogModel.findById(blogId);
    await deleteImageFromFirebase(lastObj.image_url);

    const doc = await BlogModel.findByIdAndDelete({
      _id: blogId,
    }).exec();

    if (!doc) {
      return res.status(404).json({
        message: "Блог не знайдено",
      });
    }

    res.json({
      message: "Блог успішно видалено",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Помилка при видаленні блогу",
    });
  }
};
