const express = require("express");
const router = express.Router();
const passport = require("passport");
// const { route, propfind } = require(".");

// using google strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/callback",
    },
    async function (accessToken, refreshToke, profile, done) {
      // use the profile to create an object, and enter inside the database
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value,
      };
      try {
        // query the database to find if we have an existing user, if yes, we can log it in
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          // create a user
          user = await User.create(newUser); // creates a complete user, as in the object above
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }

      // the verify callback must call cb providing a user to complete authentication
      // look for a user in the database, create one if not found
      //   console.log(profile);
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     return cb(err, user);
      //   });
    }
  )
);

// AUTHENTICATE REQUESTS
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
// retreive user data
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/dashboard",
  })
);
// ROUTE IF SOMETHING GOES WRONG
router.get("/login-failure", (req, res) => {
    res.status(400).json({message: "Something went wrong"})
});

// Destroy user session
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      res.send("Error loggin out");
    } else {
      res.redirect("/");
    }
  });
});

// presist user data after successful authentication

passport.serializeUser(function (user, done) {
  done(null, user.id); // store the userid
});
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Retrieve user data from session
module.exports = router;
