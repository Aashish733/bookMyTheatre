"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.isEmailConfigured = void 0;
const isEmailConfigured = () => Boolean(process.env.RESEND_API_KEY);
exports.isEmailConfigured = isEmailConfigured;
const sendMail = async (options) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        throw new Error("RESEND_API_KEY environment variable is not defined");
    }
    const fromEmail = "BookMyTheatre <onboarding@resend.dev>";
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
            from: fromEmail,
            to: [options.to],
            subject: options.subject,
            html: options.html,
            text: options.text,
        }),
    });
    if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Resend API error: ${errorData}`);
    }
    const result = await res.json();
    console.log("Resend ticket email response ID:", result.id);
    return result.id;
};
exports.sendMail = sendMail;
