const Follower = require("../models/follow.model");


const Follow = async (body) => {
    return await Follower.create(body);
}

const followercount = async (followId) => {
    return await Follower.countDocuments({ followId })
}

const followeingcount = async (userId) => {
    return await Follower.countDocuments({ userId })
}

const findOne = async (userId, followId) => {
    return await Follower.findOne({ userId, followId })
}

const find = async (userId) => {
    return await Follower.find({ userId }).populate("followId", "Email");
}

const acceptFollowRequest = async (requestId) => {
    return await Follower.findByIdAndUpdate(requestId, { status: "accepted" }, { new: true });
}

const rejectFollowRequest = async (requestId) => {
    return await Follower.findByIdAndDelete(requestId);
}

const requestId = async (requestId) => {
    return await Follower.findById(requestId)
}
module.exports = {
    findOne,
    find,
    Follow,
    followercount,
    requestId,
    acceptFollowRequest,
    rejectFollowRequest,
    followeingcount
}