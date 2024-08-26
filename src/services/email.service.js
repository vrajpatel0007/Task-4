const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "info.estoreservices@gmail.com",
    pass: " tselmasixebdmsme",
  },
});

/** Send Email */
const send_email = async (to, subject, html) => {
  try {
    return transport.sendMail({
      from: "<info.estoreservices@gmail.com>",
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
