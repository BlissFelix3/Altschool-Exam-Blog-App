const mongoose = require("mongoose");
const blogs = [
  {
    _id: mongoose.Types.ObjectId(),
    body: "Hello world, my name is Bliss and im from Altschool Africa",
    title: "Hello",
    description: "My desc",
    tags: "@Altschool",
    state: "published",
  },
];

module.exports = blogs;
