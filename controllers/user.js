const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user");
const { blogModel } = require("../models/blog");

require("dotenv").config();

const signUpUser = async (req, res) => {
  const user = await userModel
    .findOne({ email: req.user.email })
    .select("-password");

  user.firstname = req.body.firstName;
  user.lastname = req.body.lastName;
  user.email = req.body.email;

  await user.save();

  res.status(201).json({
    message: "Signup successful",
    user: user,
  });
};

const signInUser = (req, res, { err, user, info }) => {
  if (!user) {
    return res.json({ message: "Username or password is incorrect" });
  }

  req.login(user, { session: false }, async (error) => {
    if (error) return res.status(400).json(error);

    const body = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const token = jwt.sign(
      { user: body },
      process.env.JWT_SECRET || "something_secret",
      {
        expiresIn: process.env.JWT_LIFETIME || "1h",
      }
    );

    return res.status(200).json({ token });
  });
};

const getUserBlogs = async (req, res) => {
  const user = await userModel
    .findOne({ _id: req.params.id })
    .select("-password");

  if (!user) {
    return res
      .status(404)
      .json({ message: `No user with id : ${req.params.id}` });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const state = req.query.state;

  var blogs = await blogModel.find({}).skip(skip).limit(limit);

  if (state) {
    var blogs = await blogModel.find({ state: state }).skip(skip).limit(limit);
  }

  res.status(200).json({ blogs });
};

module.exports = {
  signUpUser,
  signInUser,
  getUserBlogs,
};
