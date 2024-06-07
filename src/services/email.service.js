const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "your email",
    pass: " password",
  },
});

/** Send Email */
const send_email = async (to, subject, html) => {
  try {
    return transport.sendMail({
      from: "<your email>",
      to,
      subject: subject,
      html: html,
    });
  } catch (error) {
    return false;
  }
};

module.exports = {
  send_email,
};
