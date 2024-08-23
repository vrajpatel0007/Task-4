const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "vraj40983@gmail.com",
    pass: " czlslfuwkbipdagi",
  },
});

/** Send Email */
const send_email = async (to, subject, html) => {
  try {
    return transport.sendMail({
      from: "<vraj40983@gmail.com>",
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
