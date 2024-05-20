const { Schema, model, mongoose } = require("mongoose");
const bcrypt  = require('bcrypt')

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
    Birthdate: {
      type: String,
    },
    OTP: {
      type: String,
    },
    Isverify: {
      type: Boolean,
      default: false,
    },
    Active: {
      type: String,
      default: "Active"
    },
    Rol: {
      type: String,
      required: true,
      default: "user",
    },
    Task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_task",
    },
    profile: {
      type: String,
      default: "public"
    },
    follower: {
      type: Number,
      default: "0"
    },
    following: {
      type: Number,
      default: "0"
    },
    post: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    }]
  },
  {
    timestamps: true,
  }
);


userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('Password')) return next();

  try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.Password, salt);
      user.Password = hashedPassword;
      next();
  } catch (error) {
      return next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
      return await bcrypt.compare(candidatePassword, this.Password);
  } catch (error) {
      throw new Error(error);
  }
};


const User = model("User", userSchema);

module.exports = User;
