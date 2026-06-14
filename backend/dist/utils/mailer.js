"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.getMailTransporter = exports.isEmailConfigured = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
const isEmailConfigured = () => Boolean(config_1.config.emailUsername && config_1.config.emailPassword);
exports.isEmailConfigured = isEmailConfigured;
let cachedTransporter = null;
const getMailTransporter = () => {
    if (!(0, exports.isEmailConfigured)()) {
        throw new Error("Email is not configured. Set NODEMAILER_EMAIL and NODEMAILER_PASSWORD in backend .env");
    }
    if (!cachedTransporter) {
        cachedTransporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: config_1.config.emailUsername,
                pass: config_1.config.emailPassword,
            },
        });
    }
    return cachedTransporter;
};
exports.getMailTransporter = getMailTransporter;
const sendMail = async (options) => {
    const transporter = (0, exports.getMailTransporter)();
    const message = {
        from: `"BookMyTheatre" <${config_1.config.emailUsername}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
    };
    const info = await transporter.sendMail(message);
    console.log(`[Email] to=${options.to} accepted=${info.accepted?.join(",")} rejected=${info.rejected?.join(",")} response=${info.response}`);
    if (info.rejected?.length) {
        throw new Error(`Email rejected for: ${info.rejected.join(", ")}`);
    }
    return info.messageId;
};
exports.sendMail = sendMail;
