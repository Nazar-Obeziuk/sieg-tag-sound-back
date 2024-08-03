import BlogModel from "../models/Blog.js";

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
    const { imageUrl, descriptions, blog_language, title, text } = req.body;
    const doc = new BlogModel({
      imageUrl,
      descriptions,
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
    const { imageUrl, descriptions, blog_language, title, text } = req.body;

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
