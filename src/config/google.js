const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/user.model");
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "43432125201-413hlaiemi6a311t8c0dk71819jou29g.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/user/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const checkEmail = await User.find({ Email: profile.email });
      if (checkEmail.length > 0) {
        return done(null, checkEmail);
      } else {
        var userData = {
          Username: profile.displayName,
          Email: profile.emails[0].value,
          Isverify: true,
        };
        var insert = await User(userData).save();
        if (insert) {
          return done(null, insert);
        } else {
          return done(null, false);
        }
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
