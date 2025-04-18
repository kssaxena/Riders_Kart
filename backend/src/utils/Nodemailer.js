import nodemailer from "nodemailer";

function SendMail(receivers, subject, text, html) {
  // async..await is not allowed in global scope, must use a wrapper
  async function main(receivers, subject, text, html) {
    // send mail with defined transport object
    const transporter = nodemailer.createTransport({
      //  host: "smtp.ethereal.email",
      service: process.env.EMAIL_SERVICE,
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: process.env.SENDER_EMAIL, // generated ethereal user
        pass: process.env.SENDER_APP_PASSWORD, // generated ethereal password
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL, // sender address
      to: receivers, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

    return info;
  }

  const MailDetails = main(receivers, subject, text, html).catch(console.error);

  return MailDetails;
}

export default SendMail;
