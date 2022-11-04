const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "Please Enter First Name"],
    maxlength: 50,
    minlength: 3,
  },
  lastName: {
    type: String,
    required: [true, "Please Enter First Name"],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please Enter  Email Address"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const userModel = mongoose.model("User", UserSchema);

module.exports = { userModel };
