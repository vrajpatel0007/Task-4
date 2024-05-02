const passport = require("passport");

const   authUser = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, userData) => {
    if (err) {
      return res.status(400).json({ msg: "error authenticating" });
    }
    if (userData == false) {
      return res.status(400).json({ msg: "authenticate your self" });
    }
    req.user = userData;
    next();
  })(req, res, next);
  
};

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.Rol === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized. Admin access required' });
  }
};



module.exports = {
  authUser,
  authorizeAdmin
};
