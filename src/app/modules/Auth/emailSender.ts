import nodemailer from 'nodemailer';
import config from '../../config';

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.emailSender.mail_service_email,
      pass: config.emailSender.mail_service_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    // from: config.googleMailServiceEmail, // sender address
    from: `${config.preffered_website_name} 🏡 <${config.emailSender.mail_service_email}>`,
    to: email, // list of receivers
    subject: 'Reset Password Link', // Subject line
    // text: '',
    html,
  });

  //console.log("Message sent: %s", info.messageId);
};

export default emailSender;
