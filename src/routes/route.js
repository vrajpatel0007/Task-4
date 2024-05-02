const express = require("express");
const routes = express.Router();
const userRoute = require("./user.route");
const admin = require("./admin.route");

routes.use("/user", userRoute);
routes.use("/admin", admin)

module.exports = routes;
