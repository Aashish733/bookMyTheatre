"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPtoEmail = exports.verifyOTP = exports.hashOTP = exports.generateOTP = void 0;
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../../config/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailgen_1 = __importDefault(require("mailgen"));
// generate otp
const generateOTP = () => {
    const otp = crypto_1.default.randomInt(1000, 9999);
    return otp;
};
exports.generateOTP = generateOTP;
// hash otp
const hashOTP = (data) => {
    if (!config_1.config.hashingSecret) {
        throw new Error("Hashing secret is not defined");
    }
    return crypto_1.default
        .createHmac("sha256", config_1.config.hashingSecret)
        .update(data)
        .digest("hex");
};
exports.hashOTP = hashOTP;
// verify otp
const verifyOTP = (hashedOTP, data) => {
    const newHashedOTP = (0, exports.hashOTP)(data);
    return newHashedOTP === hashedOTP;
};
exports.verifyOTP = verifyOTP;
// send otp to user via email;
const _config = {
    service: "gmail",
    auth: {
        user: config_1.config.emailUsername,
        pass: config_1.config.emailPassword,
    },
};
const transporter = nodemailer_1.default.createTransport(_config);
const mailGenerator = new mailgen_1.default({
    theme: "default",
    product: {
        name: "bookMyTheatre",
        link: config_1.config.frontendUrl,
        logo: "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751475322/zu4fnmh2jljzbtey77ah.png",
    },
});
// export const sendOTPtoEmail = async (email: string, otp: number) => {
//     const emailTemp:any = {
//             body: {
//                 name: '',
//                 intro: 'Welcome to bookMyTheatre! We\'re very excited to have you on board.',
//                 action: {
//                     instructions: 'To verify your account, please use the following OTP:',
//                     button: {
//                         color: '#323232', // Optional action button color
//                         text: otp,
//                         link: '#'
//                     }
//                 },
//                 outro: 'This OTP will expire in a short time (2 mins) for security reasons. If you did not request this OTP, please ignore this email.'
//             }
//         };
//         const mail = mailGenerator.generate(emailTemp);
//         let message = {
//             from : config.emailUsername,
//             to: email,
//             subject: "Your OTP for bookMyTheatre",
//             html: mail
//         }
//         const info = await transporter.sendMail(message);
//         console.log(info)
//         return info.messageId;
// }
const sendOTPtoEmail = async (email, otp) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BookMyTheatre OTP</title>

<style>
body{
    margin:0;
    padding:0;
    background:#f3f3f3;
    font-family:Arial,Helvetica,sans-serif;
}

.wrapper{
    width:100%;
    padding:30px 0;
}

.container{
    max-width:600px;
    margin:auto;
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 4px 12px rgba(0,0,0,.1);
}

.header{
    background:#1b2238;
    padding:35px;
    text-align:center;
}

.header img{
    width:180px;
}

.header h2{
    color:white;
    margin-top:20px;
    font-weight:400;
}

.content{
    padding:40px;
    text-align:center;
}

.content p{
    color:#444;
    font-size:17px;
    line-height:28px;
}

.otp{
    display:inline-block;
    background:#eceff3;
    padding:18px 45px;
    margin:25px 0;
    font-size:36px;
    font-weight:bold;
    letter-spacing:8px;
    color:#111;
    border-radius:8px;
}

.note{
    color:#666;
    font-size:14px;
    line-height:24px;
}

.footer{
    background:#fafafa;
    text-align:center;
    padding:20px;
    color:#999;
    font-size:13px;

    }
    .ticket-edge{
    height:16px;
    background-color:#1b2238;
    background-image:
        radial-gradient(circle at 10px 16px,
            #ffffff 8px,
            transparent 9px);
    background-size:20px 16px;
    background-repeat:repeat-x;
}
</style>

</head>

<body>

<div class="wrapper">

<div class="container">

<div class="header">

<img src="https://res.cloudinary.com/dp0exl89b/image/upload/v1780759879/bookmytheatre_transparent_fradxk.png">

<h2>Email Address Verification</h2>

</div>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td style="background:#1b2238;padding:0;line-height:0;font-size:0;">

<svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="12"
    viewBox="0 0 600 12"
    preserveAspectRatio="none"
    style="display:block;">

    <!-- Black strip -->
    <rect width="600" height="12" fill="#1b2238"/>

    <!-- Small closely spaced half circles -->
  <g fill="#ffffff">
    <circle cx="8" cy="12" r="4"/>
    <circle cx="26" cy="12" r="4"/>
    <circle cx="44" cy="12" r="4"/>
    <circle cx="62" cy="12" r="4"/>
    <circle cx="80" cy="12" r="4"/>
    <circle cx="98" cy="12" r="4"/>
    <circle cx="116" cy="12" r="4"/>
    <circle cx="134" cy="12" r="4"/>
    <circle cx="152" cy="12" r="4"/>
    <circle cx="170" cy="12" r="4"/>
    <circle cx="188" cy="12" r="4"/>
    <circle cx="206" cy="12" r="4"/>
    <circle cx="224" cy="12" r="4"/>
    <circle cx="242" cy="12" r="4"/>
    <circle cx="260" cy="12" r="4"/>
    <circle cx="278" cy="12" r="4"/>
    <circle cx="296" cy="12" r="4"/>
    <circle cx="314" cy="12" r="4"/>
    <circle cx="332" cy="12" r="4"/>
    <circle cx="350" cy="12" r="4"/>
    <circle cx="368" cy="12" r="4"/>
    <circle cx="386" cy="12" r="4"/>
    <circle cx="404" cy="12" r="4"/>
    <circle cx="422" cy="12" r="4"/>
    <circle cx="440" cy="12" r="4"/>
    <circle cx="458" cy="12" r="4"/>
    <circle cx="476" cy="12" r="4"/>
    <circle cx="494" cy="12" r="4"/>
    <circle cx="512" cy="12" r="4"/>
    <circle cx="530" cy="12" r="4"/>
    <circle cx="548" cy="12" r="4"/>
    <circle cx="566" cy="12" r="4"/>
    <circle cx="584" cy="12" r="4"/>
</g>

</svg>

</td>
</tr>
</table>

<div class="content">

<p>
Welcome to <b>BookMyTheatre</b> 🎬
</p>

<p>
Please enter the following OTP to verify your email address:
</p>

<div class="otp">
${otp}
</div>

<p class="note">
This OTP will expire in <b>2 minutes</b>.
</p>

<p class="note">
If you did not request this verification code,
you can safely ignore this email.
</p>

</div>

<div class="footer">

© ${new Date().getFullYear()} BookMyTheatre

</div>

</div>

</div>

</body>
</html>
`;
    const message = {
        from: `"BookMyTheatre" <${config_1.config.emailUsername}>`,
        to: email,
        subject: `${otp} is your BookMyTheatre OTP`,
        html,
    };
    const info = await transporter.sendMail(message);
    console.log(info);
    return info.messageId;
};
exports.sendOTPtoEmail = sendOTPtoEmail;
