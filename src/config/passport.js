const User = require("../models/user.model");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "vjiran";

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    const userData = await User.findOne({ _id: jwt_payload._id });
    if (userData) {
      return done(null, userData);
    } else {
      return done(null, false);
    }
  })
);
