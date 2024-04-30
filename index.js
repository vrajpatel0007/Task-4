const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const routes = require("./src/routes/route");
const connectDB = require("./src/db/dbconnect");
const bodyParser = require("body-parser");
const User = require("./src/models/user.model")
const cron = require('node-cron');
const { send_email } = require("./src/services/email.service")
const moment = require('moment');
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "ToDo",
  })
);
require("./src/config/passport");
require("./src/config/google");
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, 'src', 'views'));
app.use("views", express.static(path.join(__dirname, "src", "views")));
app.use(cookieParser());
module.exports = app;
app.use(routes);
dotenv.config({
  path: "./.env",
});

connectDB();
app.listen(process.env.PORT || 3000, () => {
  console.log(`server listening on http://localhost:${process.env.PORT}`);
});

cron.schedule('40 17 * * *', () => {
  const user = async (req, res) => {
    let today = moment().format('DD/MM')
    const user = await User.findOne()
    const birthdayDate = moment(user.Birthdate).subtract(1, 'day').format('DD/MM');
    console.log("🚀 ~ user ~ user:", user)
    console.log("🚀 ~ user ~ tody:", today)
    console.log("🚀 ~ user ~ birthdayDate:", birthdayDate)
    console.log("🚀 ~ user ~ today === birthdayDate:", today == birthdayDate)
    const birthate = moment(user.Birthdate).format('D MMMM')
    if (today == birthdayDate) {
      const email = await send_email(user.Email, user.Username, birthate)
      console.log("🚀 ~ user ~ email:", email)
    }
    console.log("🚀 ~ user ~ moment(user.birthday).format('MMMM DD'):", moment(user.Birthdate).format('DD MMMM'))
    console.log("🚀 ~ user ~ user:", user.Birthdate)
  }
  user()
  console.log('running that task every second', moment().format('DD MM YYYY hh:mm:ss'));
});
