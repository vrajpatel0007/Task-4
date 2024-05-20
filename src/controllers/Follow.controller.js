const follow_service = require("../services/follow.servise")
const user_service = require("../services/user.service")

const getFollowers = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log("🚀 ~ getFollowers ~ userId:", userId)
        const followers = await follow_service.find(userId)
        console.log("🚀 ~ getFollowers ~ followers:", followers)
        return res.status(200).json(followers);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Failed to get followers" });
    }
};

const followUser = async (req, res) => {
    try {
        const userId = req.user._id
        const reqbody = req.body;
        const followuser = await user_service.findId(reqbody.followId)
        if (followuser.profile == "private") {

            const existingRequest = await follow_service.findOne(userId, reqbody.followId);

            if (existingRequest) {
                if (existingRequest.status == "accepted") {
                    return res.status(404).json({ message: "Follow request accepted" });
                }
                return res.status(400).json({ message: "Follow request already sent" });
            }
            const pbody = {
                userId: userId,
                followId: reqbody.followId,
                status: "pending"
            }
            const newRequest = await follow_service.Follow(pbody);
            return res.status(201).json({ message: "Follow request sent successfully", newRequest });
        }
        const existingFollow = await follow_service.findOne(userId, reqbody.followId);
        if (existingFollow) {
            return res.status(400).json({ message: "User is already followed" });
        }
        const body = {
            userId: userId,
            followId: reqbody.followId,
            status: "accepted"
        };
        const newFollow = await follow_service.Follow(body);
        const followeingcont = await follow_service.followeingcount(userId)
        const updatefollweing = await user_service.follweing(userId, followeingcont)

        const followercont = await follow_service.followercount(reqbody.followId)
        const updatefollwer = await user_service.follwer(reqbody.followId, followercont)

        return res.status(201).json({ message: "User followed successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to follow user" });
    }
};


const acceptFollowRequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const requestId = req.params.requestId;
        const requestexist = await follow_service.requestId(requestId)
        if (requestexist.status == "accepted") {
            return res.status(404).json({ message: "Follow request accepted" });
        }
        const followRequest = await follow_service.acceptFollowRequest(requestId)
        if (!followRequest) {
            return res.status(404).json({ message: "Follow request not found" });
        }
        const followeingcont = await follow_service.followeingcount(userId)
        const updatefollweing = await user_service.follweing(userId, followeingcont)

        const followercont = await follow_service.followercount(requestexist.followId)
        const updatefollwer = await user_service.follwer(requestexist.followId, followercont)
        console.log("🚀 ~ acceptFollowRequest ~ updatefollwer:", updatefollwer)
        return res.status(200).json({ message: "Follow request accepted successfully", followRequest });
    } catch (error) {
        console.error("Error accepting follow request:", error);
        return res.status(500).json({ message: "Failed to accept follow request" });
    }
};

const rejectFollowRequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const requestId = req.params.requestId;
        const requestexist = await follow_service.requestId(requestId)
        if (!requestexist) {
            return res.status(404).json({ message: "Follow request not found" });
        }
        const followRequest = await follow_service.rejectFollowRequest(requestId)
        return res.status(200).json({ message: "Follow request rejected successfully" });
    } catch (error) {
        console.error("Error rejecting follow request:", error);
        return res.status(500).json({ message: "Failed to reject follow request" });
    }
};


module.exports = {
    getFollowers,
    followUser,
    acceptFollowRequest,
    rejectFollowRequest
};
