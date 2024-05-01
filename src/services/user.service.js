const User = require("../models/user.model");
const Task = require("../models/user_task.model");

const register = async (body) => {
  return User.create(body);
};

const verifyupdate = async (user) => {
  return User.findOneAndUpdate({ Email: user } , {Isverify: true , OTP : "0"} , { new: true })
}

const findemail = async (email) => {
  return await User.findOne({ Email: email });
};
const getUser = async () => {
  const alluser = await User.aggregate([
    {
      $lookup: {
        from: "user_tasks",
        localField: "_id",
        foreignField: "user_id",
        pipeline: [
          {
            $sort: { createdAt: -1 },
          },
          {
            $limit: 1,
          },
        ],
        as: "task",
      },
    },
  ]);
  return alluser;
};
const findId = async (userid) => {
  return await User.findById(userid).populate("Task", { user_id: 0 });
};
const userupdate = async (userid, body) => {
  return await User.findByIdAndUpdate(userid, { $set: body }, { new: true });
};
const deleteUser = async (userid) => {
  return await User.findByIdAndDelete(userid);
};

const usertaskid = async (userid, body) => {
  return await User.findByIdAndUpdate(userid, { Task: body }, { new: true });
};

const passupdate = async (userid, body) => {
  return await User.findByIdAndUpdate(userid,{Password: body},{new: true});
}

// task

const createtask = async (body) => {
  return await Task.create(body);
};
const tasklist = async () => {
  return await Task.find();
};
const usertask = async (userid) => {
  return await Task.find({ user_id: userid }).populate("user_id", {
    Password: 0,
  });
};
const taskByid = async (taskid) => {
  return await Task.findById(taskid);
};
const deletetask = async (taskid) => {
  return await Task.findByIdAndDelete(taskid);
};
const updatatask = async (taskid, body) => {
  return Task.findByIdAndUpdate(taskid, { $set: body }, { new: true });
};

const count = async () => {
 return await User.countDocuments()
}

module.exports = {
  register,
  verifyupdate,
  findemail,
  getUser,
  findId,
  userupdate,
  deleteUser,
  usertaskid,
  passupdate,

  // task

  createtask,
  tasklist,
  usertask,
  taskByid,
  deletetask,
  updatatask,



  count
};
