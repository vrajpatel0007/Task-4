const { string } = require("export-excel/dist/jszip");
const { Schema, model, mongoose } = require("mongoose");

const chatSchema = new Schema(
    {
        frome: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        chat: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Chat = model("chat", chatSchema);

module.exports = Chat;
