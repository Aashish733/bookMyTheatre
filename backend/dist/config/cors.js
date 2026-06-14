"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketCors = exports.corsOrigin = void 0;
exports.getAllowedOrigins = getAllowedOrigins;
const LOCAL_DEV_ORIGIN = "http://localhost:5173";
function getAllowedOrigins() {
    const raw = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "";
    const origins = raw
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
    if (process.env.NODE_ENV !== "production") {
        origins.push(LOCAL_DEV_ORIGIN);
    }
    return [...new Set(origins)];
}
const corsOrigin = (origin, callback) => {
    const allowed = getAllowedOrigins();
    if (!origin || allowed.includes(origin)) {
        callback(null, true);
        return;
    }
    callback(new Error(`Origin ${origin} not allowed by CORS`));
};
exports.corsOrigin = corsOrigin;
exports.socketCors = {
    origin: getAllowedOrigins(),
    methods: ["GET", "POST"],
    credentials: true,
};
