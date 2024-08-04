import BlogModel from "../models/Blog.js";

import bucket from "../config/firebaseConfig.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import os from "os";
import fs from "fs";

async function uploadImageToFirebase(file) {
  const uniqueFilename = `${uuidv4()}-${file.originalname}`;
  const tempFilePath = path.join(os.tmpdir(), file.originalname);
  fs.writeFileSync(tempFilePath, file.buffer);

  await bucket.upload(tempFilePath, {
    destination: `music/${uniqueFilename}`,
    metadata: {
      contentType: file.mimetype,
    },
  });

  fs.unlinkSync(tempFilePath);

  const fileRef = bucket.file(`music/${uniqueFilename}`);
  const [url] = await fileRef.getSignedUrl({
    action: 'read',
    expires: '03-01-2500',
  });

  return url;
}


// async function uploadSliderImages(files) {
//   const urls = [];
//   for (const file of files) {
//     const url = await uploadImageToFirebase(file);
//     urls.push(url);
//   }
//   return urls;
// }


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
    // const imageUrl = await uploadImageToFirebase(req.files.image_url[0]);
    let parseDescriptions = await JSON.parse(descriptions);

    const doc = new BlogModel({
      image_url: "sssd",
      descriptions: ["asd", 'asdasd'],
      blog_language,
      title,
      text,
    });

    const blog = await doc.save();

    res.json(blog);
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
    await BlogModel.updateOne(
      {
        _id: blogId,
      },
      {
        imageUrl,
        descriptions,
        blog_language,
        title,
        text,
      }
    );

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
