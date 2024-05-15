const express = require("express");
const chat_controller = require("../controllers/chat.controller")
const router = express.Router();
const { authUser } = require("../middleware/auth");

router.post("/sed", authUser, chat_controller.sed)
router.get("/chat/:userId",authUser,chat_controller.userchat)
module.exports = router