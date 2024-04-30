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
const cron = require('node-cron');
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

cron.schedule(" * * * * * * ", () => {
  console.log(
    "running that task every second",
    moment().format("DD MM YYYY hh:mm:ss")
  );
});
