const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendRecoveryCode = async (to, code) => {
  const info = await transporter.sendMail({
    from: `"Support Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Password Recovery Code",
    html: `<p>Your recovery code is: <strong>${code}</strong></p>`,
  });

  console.log("Recovery email sent:", info.messageId);
};

module.exports = { sendRecoveryCode };
