const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

export const messageGenerator = (action: string, userName?: string) => {

    const defaultHtml = `
        <img src="https://res.cloudinary.com/iteam-cloud/image/upload/v1643381088/Iteam/iteam.logo_lrlwkj.jpg" />
        <br />
        <a href="https://iteam.co.ua/home">Our site</a>
        <p>Iteam © ${new Date(Date.now()).getFullYear()}. All rights reserved</p>
    `;

    const messages = {
        invite: {
            subject: `Iteam invitation`,
            html:  `
                    <h1>Hi ${userName || ""}!</h1>
                    <p>You are invited to our application. Please use link below to become a participant</p>
                    ${defaultHtml}   
                    `,
        }
    }

    return messages[action as keyof typeof messages];
} 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD
    }
});

export default transporter;

