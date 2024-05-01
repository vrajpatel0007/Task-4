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
app.get("/", (req, res) => {
  try {
    return res.status(200).sed(`server listening on http://localhost:${process.env.PORT}`)
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
})
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

const usersAlreadyReminded = {}; // Object to track users who have been reminded

cron.schedule('0 7 * * *', async () => {
  const user = async () => {
    const today = moment().format('DD/MM');
    const users = await User.find(); // Assuming User model exists

    for (const user of users) {
      const birthdayDate = moment(user.Birthdate).subtract(1, 'day').format('DD/MM');
      console.log("🚀 ~ user ~ birthdayDate:", birthdayDate)
      const birthDateFormatted = moment(user.Birthdate).format('D MMMM');
      console.log("🚀 ~ user ~ birthDateFormatted:", birthDateFormatted)

      if (today === birthdayDate && !usersAlreadyReminded[user._id]) {
        const email = await send_email(user.Email, "Birthday Reminder", `Hello! ${user.Username} Just a friendly reminder that your birthday is tomorrow, on ${birthDateFormatted}. Don't forget to celebrate!`);
        usersAlreadyReminded[user._id] = true; // Mark user as reminded
      }
    }
  };

  user();
  console.log('Running the task every minute:', moment().format('DD MM YYYY hh:mm:ss'));
});
