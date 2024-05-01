const user_service = require("../services/user.service");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createToken = require("../middleware/auth");
const { send_otp } = require("../services/otp.service");
const axios = require("axios");

// register
const register = async (req, res) => {
  console.log(
    "==================================== registr ===================================="
  );
  const reqbody = req.body;
  console.log("🚀 ~ register ~ reqbody:", reqbody);
  try {
    if (!reqbody) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    const UserExists = await user_service.findemail(reqbody.Email);
    if (UserExists) {
      return res.status(400).json({ message: "email already exists" });
    }
    const bcrpass = await bcrypt.hash(reqbody.Password, 10);
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpsed = send_otp(reqbody.Email, otp);
    const body = {
      Username: reqbody.Username,
      Email: reqbody.Email,
      Password: bcrpass,
      Birthdate: reqbody.Birthdate,
      OTP: otp,
    };
    const user = await user_service.register(body);
    return res
      .status(200)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// verify
const verify = async (req, res) => {
  const user = req.body.Email;
  console.log("🚀 ~ verify ~ user:", user);
  try {
    const UserExists = await user_service.findemail(user);
    console.log("🚀 ~ userupdate ~ UserExists:", UserExists);
    if (!UserExists) {
      return res.status(404).json({ message: "User Not exists" });
    }
    if (req.body.OTP == UserExists.OTP) {
      const users = await user_service.verifyupdate(user);
      return res.status(200).json({ message: "Verify Successfully" });
    }
    return res.status(404).json({ message: "OTP not found" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// profile
const profile = async (req, res) => {
  try {
    const user = await user_service.findId(req.user._id);
    console.log("🚀 ~ profile ~ user:", user);
    return res.status(200).json({ message: "User Profile", user: user });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// list_User
const userlist = async (req, res) => {
  console.log(
    "==================================== list_User ===================================="
  );
  try {
    const user = await user_service.getUser();
    return res.status(200).json({ message: "All user ", user: user });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// Update_User
const userupdate = async (req, res) => {
  console.log(
    "==================================== Update_User ===================================="
  );
  const userid = req.params.userId;
  console.log("🚀 ~ userupdate ~ userid:", userid);
  try {
    const UserExists = await user_service.findId(userid);
    console.log("🚀 ~ userupdate ~ UserExists:", UserExists);
    if (!UserExists) {
      return res.status(404).json({ message: "User Not exists" });
    }
    const body = {};
    if (req.body) {
      body.Name = req.body.Name;
      body.Email = req.body.Email;
    }
    const userupdate = await user_service.userupdate(userid, body);
    return res.status(200).json({ message: "User Updated Successfully" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// UserById
const userbyid = async (req, res) => {
  console.log(
    "==================================== UserById ===================================="
  );
  const userid = req.params.userId;
  try {
    const userExists = await user_service.findId(userid);
    if (!userExists) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const user = await user_service.findId(userid);
    return res
      .status(200)
      .json({ message: "User Finde Successfully", user: user });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// Delete_Users
const usersdelete = async (req, res) => {
  console.log(
    "==================================== Delete_Users ===================================="
  );
  const userid = req.params.userId;
  try {
    const userExists = await user_service.findId(userid);
    if (!userExists) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const usrer = await user_service.deleteUser(userid);
    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// login
const login = async (req, res) => {
  console.log(
    "==================================== login ===================================="
  );
  try {
    const body = req.body;
    console.log("🚀 ~ login ~ body:", body);
    const Password = req.body.Password;
    console.log("🚀 ~ login ~ Password:", Password);
    const user = await user_service.findemail(body.Email);
    console.log("🚀 ~ login ~ body.Email:", body.Email);
    console.log("🚀 ~ login ~ user:", user);
    if (user.Isverify != true) {
      return res.status(403).json({ message: "Your Email is not verified" });
    }
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const bcryptpass = await bcrypt.compare(Password, user.Password);
    if (!bcryptpass) {
      return res.status(404).json({ message: "Incorrect Password" });
    }
    const payload = {
      _id: user._id,
      email: user.Email,
    };
    console.log("🚀 ~ login ~ payload.email:", payload);
    const token = jwt.sign(payload, process.env.SECRET_key, {
      expiresIn: "1d",
    });
    // const toke = res.cookie("token", token)
    console.log("🚀 ~ login ~ token:", token);
    res.status(200).json({ message: "User Login Successful", token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update password
const updatepassword = async (req, res) => {
  const userid = req.params.userId;
  console.log("🚀 ~ updatepassword ~ userid:", userid);
  try {
    const userExists = await user_service.findId(userid);
    console.log("🚀 ~ updatepassword ~ userExists:", userExists);
    if (!userExists) {
      return res.status(400).json({ message: "User Not Found" });
    }
    if (!req.body.Password) {
      return res.status(400).json({ message: "Password nod Difain" });
    }
    if (!req.body.Confirmpassword) {
      return res.status(400).json({ message: "Confirmpassword nod Difain" });
    }
    if (req.body.Password != req.body.Confirmpassword) {
      return res
        .status(400)
        .json({ message: "Confirmpassword and password not match" });
    }
    const pass = await bcrypt.hash(req.body.Password, 10);
    console.log("🚀 ~ updatepassword ~ bcrpass:", pass);
    const usrer = await user_service.passupdate(userid, pass);
    console.log("🚀 ~ updatepassword ~ usrer:", usrer);
    return res
      .status(200)
      .json({ message: "User password Successfully  Update" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// Task

// Create Task
const createtask = async (req, res) => {
  console.log(
    "==================================== createtask ===================================="
  );
  try {
    const userExists = await user_service.findId(req.user._id);
    console.log("🚀 ~ createtask ~ userExists:", userExists);

    if (!userExists) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (!req.files || !req.files.image || !req.files.image[0]) {
      console.log("🚀 ~ createtask ~ req.files:", req.files);
      return res.status(400).json({ message: "Image file not provided" });
    }

    const body = {
      Title: req.body.Title,
      Description: req.body.Description,
      image: "public/temp/" + req.files.image[0].filename,
      user_id: req.user._id,
    };

    const task = await user_service.createtask(body);
    const taskid = await user_service.usertaskid(req.user._id, task._id);
    console.log("🚀 ~ createtask ~ taskid:", taskid);
    return res
      .status(200)
      .json({ message: "Task created successfully", data: task });
  } catch (error) {
    console.error("Error in createtask:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Task List
const tasklist = async (req, res) => {
  console.log(
    "==================================== tasklist ===================================="
  );
  try {
    const list = await user_service.tasklist();
    return res.status(200).json({ message: "Task list", data: list });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Userby Id task
const userbyidt = async (req, res) => {
  console.log(
    "==================================== UserByIdt ===================================="
  );
  console.log("🚀 ~ userbyidt ~ userid:", req.user);
  console.log("🚀 ~ userbyidt ~ userid:", req.user._id);
  try {
    const userExists = await user_service.findId(req.user._id);
    console.log("🚀 ~ userbyidt ~ userExists:", userExists);
    if (!userExists) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const usertask = await user_service.usertask(req.user._id);
    // await usertask.populate("User")
    console.log("🚀 ~ userbyidt ~ usertask:", usertask);
    return res.status(200).json({ message: "User Task", data: usertask });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Task Delete
const taskdelete = async (req, res) => {
  console.log(
    "==================================== taskdelete ===================================="
  );
  const taskid = req.params.taskId;
  console.log("🚀 ~ taskdelete ~ taskid:", taskid);
  try {
    const taskExists = await user_service.taskByid(taskid);
    console.log("🚀 ~ taskdelete ~ taskExists:", taskExists);
    if (!taskExists) {
      return res.status(400).json({ message: "Task Not Exists" });
    }
    if (taskExists.image) {
      const parth = taskExists.image;
      fs.unlink(parth, (err) => {
        if (err) {
          console.log(`An error occurred ${err.message}`);
        } else {
          console.log("Deleted image");
        }
      });
      const deltask = await user_service.deletetask(taskid);
      return res.status(200).json({ message: "Task Delete Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Task Update
const taskupdate = async (req, res) => {
  console.log(
    "==================================== taskupdate ===================================="
  );
  const taskid = req.params.taskId;
  const task = req.body;
  console.log("🚀 ~ taskupdate ~ task:", task);
  console.log("🚀 ~ taskupdate ~ taskid:", taskid);
  try {
    const taskExists = await user_service.taskByid(taskid);
    console.log("🚀 ~ taskdelete ~ taskExists:", taskExists);
    if (!taskExists) {
      return res.status(400).json({ message: "Task Not Exists" });
    }
    const body = {};
    if (req.body) {
      (body.Title = req.body.Title), (body.Description = req.body.Description);
    }
    if (req.files && req.files.image) {
      const parth = taskExists.image;
      fs.unlink(parth, (err) => {
        if (err) {
          console.log(`An error occurred ${err.message}`);
        } else {
          console.log("Deleted image");
        }
      });
      body.image = "public/temp/" + req.files.image[0].filename;
    }
    console.log("🚀 ~ taskupdate ~ body:", body);
    const update = await user_service.updatatask(taskid, body);
    return res
      .status(200)
      .json({ message: "Task Updata successfully", data: update });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// restapi

const restapi = async (req, res) => {
  // try {
  //   const response = await axios.get("https://api.restful-api.dev/objects");
  //   const data = response.data;
  //   return res.status(200).json(data);
  // } catch (error) {
  //   return res.status(500).json({ message: error.message });
  // }

  // axios
  //   .get("https://api.restful-api.dev/objects")
  //   .then((response) => {
  //     const data = response.data;
  //     return res.status(200).json(data);
  //   })
  //   .catch((error) => {
  //     return res.status(500).json({ message: error.message });
  //   });

  try {
    fetch("https://api.restful-api.dev/objects").then(async (response) => {
      const data = await response.json();
      return res.status(200).json(data);
    });
  } catch (error) {
    console.log("🚀 ~ restapi ~ error:", error);
  }
};

const count = async (req, res) => {
  try {
    const count = await user_service.count()
    return res.status(200).json({message: count});
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  register,
  verify,
  profile,
  userlist,
  userupdate,
  userbyid,
  usersdelete,
  login,
  updatepassword,

  // task

  createtask,
  tasklist,
  userbyidt,
  taskdelete,
  taskupdate,
  restapi,


  count,
};
