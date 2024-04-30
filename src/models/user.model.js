const { Schema, model, mongoose } = require("mongoose");

const userSchema = new Schema(
  {
    Username: {
      type: String,
    },
    Email: {
      type: String, 
    },
    Password: {
      type: String,
    },
    Birthdate:{
      type: String,
    },
    OTP :{
      type: String,
    },
    Isverify:{
      type: Boolean,
      default: false,
    },
    Task:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_task",
    }
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
