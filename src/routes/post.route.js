const express = require("express");
const router = express.Router();
const post_controller = require("../controllers/post.controller");
const upload = require("../middleware/multer");
const { authUser } = require("../middleware/auth");

router.post("/create", authUser, upload.fields([{ name: "image", maxCount: 1 }]), post_controller.createpost)
router.get("/post_list", authUser, post_controller.list)
router.delete("/post_delete", authUser, post_controller.delet_post)
router.get("/userpost", authUser, post_controller.userpost)
router.get("/users_post", authUser, post_controller.users_post)


router.post("/like", authUser, post_controller.like)


router.post("/comments", authUser, post_controller.comment)
router.delete("/deletecomment", authUser, post_controller.commentdelet)

module.exports = router;