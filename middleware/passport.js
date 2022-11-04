const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { userModel } = require("../models/user");

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET || "something_secret",
      // jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const email = req.body.email;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      try {
        const user = await userModel.create({
          firstName,
          lastName,
          email,
          password,
        });

        return done(null, user, { message: "User created successfully" });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const email = req.body.email;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      try {
        const user = await userModel.findOne({ email, firstName, lastName });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await user.comparePassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
