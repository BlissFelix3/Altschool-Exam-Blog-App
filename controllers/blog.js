const { blogModel } = require("../models/blog");
const { userModel } = require("../models/user");
const moment = require("moment");

const getAllBlogs = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const author = req.query.author;
  const title = req.query.title;
  const tags = req.query.tags;

  var blogs = await blogModel.find({}).skip(skip).limit(limit);

  if (author) {
    var blogs = await blogModel.find({ author: author });
  }

  if (title) {
    var blogs = await blogModel.find({ title: title });
  }

  if (tags) {
    var blogs = await blogModel.find({ tags: tags });
  }

  res.status(200).json({ blogs });
};

const getAllBlogsByOrder = async (req, res) => {
  const read_count = req.query.read_count;
  const reading_time = req.query.reading_time;
  const timestamps = req.query.timestamps;

  if (read_count === "ascending") {
    const ascending = await blogModel
      .find({ state: "published" })
      .sort({ read_count: 1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      blogs: { ascending },
      message: "read_count is in ascending order",
    });
  } else if (read_count === "descending") {
    const descending = await blogModel
      .find({ state: "published" })
      .sort({ read_count: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      blogs: { descending },
      message: "read_count is in descending order",
    });
  }

  if (reading_time === "ascending") {
    const ascending = await blogModel
      .find({ state: "published" })
      .sort({ reading_time: 1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      blogs: { ascending },
      message: "reading_time is in ascending order",
    });
  } else if (reading_time === "descending") {
    const descending = await blogModel
      .find({ state: "published" })
      .sort({ reading_time: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      blogs: { descending },
      message: "reading_time is in descending order",
    });
  }

  if (timestamps === "ascending") {
    const ascending = await blogModel
      .find({ state: "published" })
      .sort({ timestamps: 1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      blogs: { ascending },
      message: "timestamps is in ascending order",
    });
  } else if (timestamps === "descending") {
    const descending = await blogModel
      .find({ state: "published" })
      .sort({ timestamps: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      blogs: { descending },
      message: "timestamps is in descending order",
    });
  }

  const descending = await blogModel
    .find({ state: "published" })
    .sort({ read_count: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    blogs: { descending },
    message: "Most read blogs",
  });
};

const createBlogs = async (req, res) => {
  const body = req.body.body;
  const wpm = 225;
  const words = body.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm + 1);

  const blogData = {
    title: req.body.title,
    description: req.body.description,
    tags: req.body.tags,
    author: req.user._id,
    body: body,
    // Default/lowest time span with this calc is 2mins
    reading_time: `${time}mins`,
    timestamps: moment().toDate(),
  };

  const blog = await blogModel.create(blogData);

  const user = await userModel.findById(req.user._id);

  user.blogs.push(blog._id);

  await user.save();

  res.status(200).json({ blog });
};

const getSingleBlog = async (req, res) => {
  const { id: blogId } = req.params;
  const blog = await blogModel
    .findOne({ _id: blogId })
    .populate("author", "-password")

  if (!blog) {
    res.status(404).json({ message: `No Blog with id: ${blogId} ` });
  }

  blog.read_count++;

  await blog.save();

  res.status(200).json({ blog });
};

const publishBlog = async (req, res) => {
  const { id: blogId } = req.params;
  const blog = await blogModel.findOne({ _id: blogId });

  if (!blog) {
    return res.status(404).json({ message: `No Blog with id: ${blogId} ` });
  }

  blog.state = req.body.state;

  await blog.save();

  res.status(200).json({ blog });
};

const updateBlog = async (req, res) => {
  const { id: blogId } = req.params;
  const blog = await blogModel.findOne({ _id: blogId });

  if (!blog) {
    res.status(404).json({ message: `No Blog with id: ${blogId} ` });
  }

  (blog.title = req.body.title),
    (blog.description = req.body.description),
    (blog.tags = req.body.tags),
    (blog.body = req.body.body),
    (blog.state = req.body.state);
  await blog.save();

  res.status(200).json({ blog });
};

const deleteBlog = async (req, res) => {
  const { id: blogId } = req.params;
  const blog = await blogModel.findOneAndDelete({ _id: blogId });

  if (!blog) {
    return res.status(404).json({ message: `No Blog with id: ${blogId} ` });
  }

  await blog.remove();

  res.status(200).json({ message: "Blog has been sucessfully deleted" });
};

module.exports = {
  getAllBlogs,
  getAllBlogsByOrder,
  createBlogs,
  getSingleBlog,
  publishBlog,
  updateBlog,
  deleteBlog,
};
