const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    followId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    followedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
});

const Follower = mongoose.model("Follower", followerSchema);

module.exports = Follower;
