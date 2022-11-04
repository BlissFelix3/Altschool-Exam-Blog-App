const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  getAllBlogs,
  getAllBlogsByOrder,
  getSingleBlog,
  createBlogs,
  publishBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog");

router
  .route("/")
  .get(getAllBlogs)
  .post(passport.authenticate("jwt", { session: false }), createBlogs);

router.get("/order", getAllBlogsByOrder);

router
  .route("/:id")
  .get(getSingleBlog)
  .patch(passport.authenticate("jwt", { session: false }), publishBlog)
  .put(passport.authenticate("jwt", { session: false }), updateBlog)
  .delete(passport.authenticate("jwt", { session: false }), deleteBlog);

module.exports = router;
