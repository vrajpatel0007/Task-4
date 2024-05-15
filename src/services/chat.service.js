const Chat = require("../models/chat.model")

const save = async (data) => {
    return await Chat.create(data)
}

const userchat = async (to) => {
    return await Chat.find({to})
}
const findeid = async (id)=>{
    return await Chat.findOne({to:id})
}

module.exports = {
    save,
    userchat,
    findeid
}
