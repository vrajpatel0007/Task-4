const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "<email>",
    pass: " <password>",
  },
});

/** Send OTP */
const send_otp = async (to , otp) => {
  
  try {
    return transport.sendMail({
      from: "<email>",
      to,
      subject: "OTP Message",
      html: `your OTP is:${otp}`,
    });
  } catch (error) {
    return false;
  }
};

module.exports = {
  send_otp,
};
