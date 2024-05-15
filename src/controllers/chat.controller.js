// chat_controller.js
const chat_service = require("../services/chat.service");

const sed = async (req, res) => {
    const fromId = req.user._id;
    const { to, message } = req.body;
    try {

        console.log("🚀 ~ sed ~ req.body:", req.body);
        console.log("🚀 ~ sed ~ fromId:", fromId);

        const data = {
            frome: fromId,
            to,
            chat: message
        };
        console.log("🚀 ~ sed ~ data:", data);

        const chat = await chat_service.save(data);
        console.log("🚀 ~ sed ~ chat:", chat);

        return res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.log("🚀 ~ sed ~ , error.message :", error.message)
        return res.status(400).json({ message: "Failed to send message" });
    }
};

const userchat = async (req, res) => {
    const toid = req.params.userId
    console.log("🚀 ~ userchat ~ toid:", toid)
    const from = req.user._id
    try {
        const toExist = await chat_service.findeid(toid)
        console.log("🚀 ~ userchat ~ toExist:", toExist)
        if (!toExist) {
            return res.status(400).json({ message: "no messages" })
        }
        const chat = await chat_service.userchat(toid)
        const uschat = chat.to
        console.log("🚀 ~ userchat ~ uschat:", uschat)
        console.log("🚀 ~ userchat ~ chat:", chat)
        return res.status(200).json({ message: "successfully chat get", chat })

    } catch (error) {
        console.log("🚀 ~ sed ~ , error.message :", error.message)
        return res.status(400).json({ message: "Failed to send message" });
    }
}

module.exports = {
    sed,
    userchat
};
