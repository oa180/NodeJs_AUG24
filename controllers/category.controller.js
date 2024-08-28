const categoryModel = require("../models/category.model");

exports.createCategory = async (req, res) => {
  try {
    const newCategory = await categoryModel.create(req.body);

    res.status(201).json({ message: "success", data: newCategory });
  } catch (error) {
    res.status(500).json({ message: "fail", error });
  }
};
