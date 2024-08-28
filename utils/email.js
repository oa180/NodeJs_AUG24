const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  // 1) Create transporter (service send email)
  const transporter = nodemailer.createTransport({
    // service: "Mail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2)  define email option
  const mailOptions = {
    from: "oa2180180@gmail.com",
    to: options.emilTo,
    subject: options.emailSubject,
    text: options.message,
  };

  // 3) send email
  await transporter.sendMail(mailOptions);
};
