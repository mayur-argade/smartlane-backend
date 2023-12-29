import * as nodemailer from 'nodemailer';

const sendEmail = async (email: string, subject: string, token: number) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            user: 'sashanksingh357@gmail.com',
            pass: 'qhzw zfrt pzbf ipqp',
        },
    });

    // Set up the email content
    const mailOptions = {
        from: 'Support@smartlaneapp.co.uk',
        to: email,
        subject: subject,
        text: 'Here is your OTP: ' + token
    };

    // Send the email
    return new Promise<void>((resolve, reject) => {
        transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
                console.log("error email" , error);
                reject(error);
            } else {
                console.log('Email sents: ' + info.response);
                resolve();
            }
        });
    });
}
export default sendEmail;
