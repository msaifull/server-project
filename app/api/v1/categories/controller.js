const Category = require("./model");
const { StatusCodes } = require("http-status-codes");
const CustomAPI = require("../../../errors");
const { findOne } = require("./model");

const getAllCategory = async (req, res, next) => {
  try {
    //const result = await Category.find({}); jika create tidak berdasarkan user yg login
    const result = await Category.find({ user: req.user.id});

    console.log(req.user);

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = req.user.id;

    const check = await Category.findOne({
      user,
      name,
    });

    if (check) throw new CustomAPI.BadRequestError("Duplicate Name Category");
    const result = await Category.create({ name, user });

    res.status(StatusCodes.CREATED).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const getOneCategory = async (req, res, next) => {
  try {
    const { id: categoryId } = req.params; //buat variable, lalu dapatkan id dari params

    const result = await Category.findOne({
      _id: categoryId,
      user: req.user.id,
    }); // cek datanya ada atau gak

    if (!result) {
      //jika tdk dapat kita kasih tau kl id gak ada
      throw new CustomAPI.NotFoundError("No Category With id :" + categoryId);
    }

    res.status(StatusCodes.OK).json({ data: result }); //jika data nya ada, kita tampilkan datanya dalam bentuk objek
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id: categoryId } = req.params;
    const { name } = req.body;

    const check = await Category.findOne({
      name,
      _id: { $ne: categoryId }, //fungsi dari mongoose => menegecek yg tidak sama dengan Id tsb
    });

    if (check) {
      throw new CustomAPI.BadRequestError("Duplicate name category");
    }

    const result = await Category.findOneAndUpdate(
      {
        _id: categoryId,
      },
      { name, user: req.user.id },
      { new: true, runValidators: true }
    );

    if (!result) {
      throw new CustomAPI.NotFoundError("No category With id: " + categoryId);
    }

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id: categoryId } = req.params;
    const result = await Category.findOne({ _id: categoryId });

    if (!result) {
      throw new CustomAPI.NotFoundError("No Category With Id :" + categoryId);
    }

    await result.deleteOne();
    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err)
  }
};

module.exports = {
  getAllCategory,
  createCategory,
  getOneCategory,
  updateCategory,
  deleteCategory,
};


