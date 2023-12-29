import * as nodemailer from "nodemailer";

const sendPropertyMail = async (subject: string, data: any) => {
  const origin = `http://localhost`;
  const message = `<p>Raised request from USERNAME: ${data.full_name} to add property for POSTCODE: ${data.postcode} <a href="${origin}">link</a> </p>`;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: "sashanksingh357@gmail.com",
      pass: "qhzw zfrt pzbf ipqp"
    },
  });

  // Set up the email content
  const mailOptions = {
    from: "Support@smartlaneapp.co.uk",
    to: "sashanksingh357@gmail.com",
    subject: subject,
    html: `${message}`,
  };

  // Send the email
  return new Promise<void>((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Email sent: " + info.response);
        resolve();
      }
    });
  });
};
export default sendPropertyMail;
