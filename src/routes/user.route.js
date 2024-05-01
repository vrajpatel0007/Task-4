const express = require("express");
const user_controller = require("../controllers/user.controller");
const upload = require("../middleware/multer");
const router = express.Router();
const fs = require("fs");
const { authUser } = require("../middleware/auth");
const path = require("path");
const passport = require("passport");
router.post("/register", user_controller.register);
router.put("/verify", user_controller.verify);
router.get("/list", authUser, user_controller.userlist);
router.get("/profile", authUser, user_controller.profile);
router.get("/restapi", user_controller.restapi);
router.get("/userByid/:userId", authUser, user_controller.userbyid);
router.put("/userupdate/:userId", authUser, user_controller.userupdate);
router.delete("/usersdelete/:userId", authUser, user_controller.usersdelete);
router.post("/login", user_controller.login);
router.put("/updatepassword/:userId", user_controller.updatepassword);

// user_task
router.post(
  "/createtask",
  upload.fields([{ name: "image", maxCount: 1 }]),
  authUser,
  user_controller.createtask
);

router.get("/tasklist", authUser, user_controller.tasklist);
router.get("/useridbytask", authUser, user_controller.userbyidt);
router.put(
  "/taskupdate/:taskId",
  upload.fields([{ name: "image", maxCount: 1 }]),
  authUser,
  user_controller.taskupdate
);

router.delete("/taskdelete/:taskId", authUser, user_controller.taskdelete);

function sendHtmlFile(res, fileName) {
  const filePath = path.join(__dirname, "..", "views", fileName + ".html");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Internal Server Error");
    }

    res.send(data);
  });
}

router.get("/home", async function (req, res) {
  sendHtmlFile(res, "home");
});

router.get("/about", async function (req, res) {
  sendHtmlFile(res, "about");
});

router.get("/contact", async function (req, res) {
  sendHtmlFile(res, "contact");
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/user/auth/google/success",
    failureRedirect: "/user/auth/google/failure",
  })
);

router.get('/auth/google/success', (req, res) => {
  res.send('Authentication with Google successful!');
});

// Route for failure after Google authentication
router.get('/auth/google/failure', (req, res) => {
  res.send('Authentication with Google failed!');
});


router.post("/export-excel")
router.post("/admin/signup")
router.post("/admin/login")
router.post("/admin/:userId/block")
router.post("/admin/:userId/unblock")
router.get('/count', user_controller.count)

module.exports = router;
