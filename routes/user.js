const express = require("express");
const passport = require("passport");
const router = express.Router();

const { signUpUser, signInUser, getUserBlogs } = require("../controllers/user");

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  signUpUser
);
router.post("/signin", async (req, res, next) =>
  passport.authenticate("login", (err, user, info) => {
    signInUser(req, res, { err, user, info });
  })(req, res, next)
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getUserBlogs
);

module.exports = router;
