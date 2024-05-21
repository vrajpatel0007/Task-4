const post_service = require("../services/post.service")

const createpost = async (req, res) => {
    const reqbody = req.body
    console.log("🚀 ~ createpost ~ reqbody:", reqbody)
    const userId = req.user._id
    console.log("🚀 ~ createpost ~ userId:", userId)
    try {
        if (!reqbody.user || !reqbody.caption) {
            return res.status(400).json({ message: "fil tha all fild" })
        }
        if (!req.files || !req.files.image || req.files.image.length === 0) {
            return res.status(400).json({ message: "Image is required" });
        }
        const body = {
            user: userId,
            image: "http://localhost:8000/public/temp/" + req.files.image[0].filename,
            caption: reqbody.caption
        }
        const post = await post_service.createpost(body)
        console.log("🚀 ~ createpost ~ post:", post)
        return res.status(200).json({ message: "post create", post })
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

const list = async (req, res) => {
    try {
        const list = await post_service.list();
        return res.status(200).json({ message: "All list ", post: list });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

const delet_post = async (req, res) => {
    const postId = req.body.postId
    console.log("🚀 ~ constdelet_post= ~ postId:", postId)
    try {
        const postExists = await post_service.findId(postId);
        console.log("🚀 ~ constdelet_post= ~ postExists:", postExists)
        if (!postExists) {
            return res.status(404).json({ message: "post Not Found" });
        }
        const post = await post_service.deletepost(postId);
        return res.status(200).json({ message: "Post Deleted Successfully" });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

const userpost = async (req, res) => {
    const userId = req.user._id
    console.log("🚀 ~ userpost ~ userId:", userId)
    try {
        const list = await post_service.posts(userId);
        return res.status(200).json({ message: "user post list ", post: list });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

const users_post = async (req, res) => {
    const userId = req.body.userId
    console.log("🚀 ~ userpost ~ userId:", userId)
    try {
        const list = await post_service.posts(userId);
        return res.status(200).json({ message: "user post list ", post: list });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}


const like = async (req, res) => {
    const postId = req.body.postId
    console.log("🚀 ~ like ~ postId:", postId)
    const userId = req.user._id
    console.log("🚀 ~ like ~ userId:", userId)
    try {
        const postexist = await post_service.findId(postId)
        console.log("🚀 ~ like ~ postexist:", postexist)
        if (!postexist) {
            return res.status(400).json({ message: " post not exist " });
        }
        const like = {
            user: userId,
            post: postId
        }
        console.log("🚀 ~ like ~ like:", like)
        const likes = await post_service.like(like)
        console.log("🚀 ~ like ~ likes:", likes)
        const likecount = await post_service.Likecount(postId)
        console.log("🚀 ~ like ~ likecount:", likecount)
        const postupdate = await post_service.postupdate(postId, likecount)

        return res.status(200).json({ message: "like added successfully", like: likes });
    } catch ({ error }) {
        return res.status(404).json({ message: error });
    }
}

const comment = async (req, res) => {
    const postId = req.body.postId
    console.log("🚀 ~ comment ~ postId:", postId)
    console.log("🚀 ~ comment ~ comment:", comment)
    const userId = req.user._id
    console.log("🚀 ~ comment ~ userId:", userId)
    try {
        const postexist = await post_service.findId(postId)
        console.log("🚀 ~ like ~ postexist:", postexist)
        if (!postexist) {
            return res.status(400).json({ message: " post not exist " });
        }
        const body = {
            Comment: req.body.comment,
            user: userId,
            post: postId
        }
        console.log("🚀 ~ comment ~ body:", body)
        const comments = await post_service.comment(body)
        console.log("🚀 ~ comment ~ comment:", comments)
        return res.status(200).json({ message: "comment successfully", comment: comments });
    } catch (error) {
        return res.status(404).json({ message: error });
    }
}

const commentdelet = async (req, res) => {
    const reqbody = req.body
    console.log("🚀 ~ commentde ~ reqbody:", reqbody)
    try {
        const commentExist = await post_service.commentfinde(reqbody.commentId)
        console.log("🚀 ~ commentde ~ commentExist:", commentExist)
        if (!commentExist) {
            return res.status(400).json({ message: "comment not finde" })
        }
        const commentdelete = await post_service.commentdelet(reqbody.commentId)
        return res.status(200).json({ message: "comment successfully Delete" });
    } catch (error) {
        return res.status(404).json({ message: error });
    }
}

const postcomment = async (req,res)=>{
    const postId = req.body.postId
    try {
        const postExist = await post_service.findId(postId)
        if (!postExist) {
            return res.status(400).json({ message: " post not exist " });
        }
        const comment = await post_service.postcomment(postId)
        return res.status(200).json({message:"post comment",comment})
    } catch (error) {
        return res.status(404).json({ message: error });
    }
}

const postlikes = async( req,res)=>{
    const postId = req.body.postId
    try {
        const postExist = await post_service.findId(postId)
        if (!postExist) {
            return res.status(400).json({ message: " post not exist " });
        }
        const postlikes = await post_service.postlikes(postId)
        return res.status(200).json({message:"post likes",postlikes})
    } catch (error) {
        return res.status(404).json({ message: error });
    }
}

module.exports = {
    createpost,
    list,
    delet_post,
    userpost,
    users_post,
    postcomment,


    like,
    comment,
    commentdelet,
    postlikes
}
