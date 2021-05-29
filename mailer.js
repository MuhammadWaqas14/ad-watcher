const nodemailer = require("nodemailer");

exports.sendConfirmationEmail = function ({ toUser, hash }) {
  return new Promise((res, rej) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASSWORD,
      },
    });
    const message = {
      from: `Umar@AdWatcher.com <${process.env.GOOGLE_USER}>`,
      to: toUser.email,
      // to: process.env.GOOGLE_USER,
      subject: "Umar from Adwatcher: Account Activation",
      html: `<h3>Hello ${toUser.user_name}</h3>
            <p> Thank you for registering on AdWatcher.com. Just one more step...<p/>
            <p>Please follow this link to activate your account:
            <a target="_" href="http://adwatcher.herokuapp.com/users/activate/user/${hash}">Activate Link</a></p>
            <p>Thank You, </p>
            <p>Team AdWatcher</p>
            `,
    };
    transporter.sendMail(message, function (err, info) {
      if (err) {
        rej(err);
      } else {
        res(info);
      }
    });
  });
};
