const express = require("express");
const router = express.Router();
const follower_controller = require("../controllers/Follow.controller");
const { authUser } = require("../middleware/auth");


router.post("/follow", authUser,follower_controller.followUser);

router.get("/following",authUser, follower_controller.getFollowers);

router.put("/requests/:requestId/accept", authUser, follower_controller.acceptFollowRequest);

router.put("/requests/:requestId/reject", authUser, follower_controller.rejectFollowRequest);


module.exports = router;
