const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "<your email>",
    pass: " <password>",
  },
});

/** Send Email */
const send_email = async (to,Username, birthdayDate) => {
  try {
    return transport.sendMail({
      from: "<your email>",
      to,
      subject: "Birthday Reminder",
      html:`Hello! ${Username} Just a friendly reminder that your birthday is tomorrow, on ${birthdayDate}. Don't forget to celebrate!`,
    });
  } catch (error) {
    return false;
  }
};

module.exports = {
  send_email,
};
