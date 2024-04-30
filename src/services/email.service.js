const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "<your email>",
    pass: " <passowerd>",
  },
});

/** Send Email */
const send_email = async (to, subject, html) => {
  try {
    return transport.sendMail({
      from: "<frome>",
      to,
      subject,
      html,
    });
  } catch (error) {
    return false;
  }
};

module.exports = {
  send_email,
};
