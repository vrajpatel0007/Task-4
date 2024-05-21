const Post = require("../models/post.model")
const User = require("../models/user.model")
const Like = require("../models/like.mode")
const Comment = require("../models/Comment.mode")

const createpost = async (body) => {
    return await Post.create(body)
}



const list = async () => {
    return await Post.find()
}

const deletepost = async (postId) => {
    return Post.findByIdAndDelete(postId)
}

const findId = async (postId) => {
    return await Post.findById(postId)
}

const posts = async (userId) => {
    return await Post.find({ user: userId })
}

const Likecount = async (post) => {
    return await Like.countDocuments({ post })
}

const like = async (body) => {
    return await Like.create(body)
}
const postupdate = async (postid, likes) => {
    return await Post.findByIdAndUpdate(postid, { likes: likes }, { new: true })
}

const comment = async (body) => {
    console.log("🚀 ~ comment ~ body:", body)
    return await Comment.create(body)
}

const commentdelet = async (commentId)=>{
    return await Comment.findByIdAndDelete(commentId)
}

const commentfinde = async (commentId) =>{
    return await Comment.findById(commentId)
}

const postcomment = async (post)=>{
    return Comment.find({post})
}

const postlikes = async (post)=>{
    return await Like.find({post})
}

module.exports = {
    createpost,
    list,
    deletepost,
    findId,
    posts,

    // like
    like,
    Likecount,
    postupdate,
    comment,
    commentdelet,
    commentfinde,
    postcomment,
    postlikes

}