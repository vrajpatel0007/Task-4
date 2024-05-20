const express = require("express");
const routes = express.Router();
const userRoute = require("./user.route");
const admin = require("./admin.route");
const chat = require("./chat.route")
const Follow = require("./Follow.route")
const post = require("./post.route")

routes.use("/user", userRoute);
routes.use("/admin", admin)
routes.use("/chat", chat)
routes.use("/Follow", Follow)
routes.use("/post", post)

module.exports = routes;
