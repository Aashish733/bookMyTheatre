"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchImageBuffer = exports.isAllowedImageUrl = void 0;
const ALLOWED_HOSTS = new Set([
    "res.cloudinary.com",
    "api.qrserver.com",
    "image.tmdb.org",
]);
const isAllowedImageUrl = (rawUrl) => {
    try {
        const parsed = new URL(rawUrl);
        return parsed.protocol === "https:" && ALLOWED_HOSTS.has(parsed.hostname);
    }
    catch {
        return false;
    }
};
exports.isAllowedImageUrl = isAllowedImageUrl;
const fetchImageBuffer = async (rawUrl) => {
    if (!(0, exports.isAllowedImageUrl)(rawUrl)) {
        throw new Error("Image URL is not allowed");
    }
    const response = await fetch(rawUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image (${response.status})`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    return {
        buffer: Buffer.from(arrayBuffer),
        contentType,
    };
};
exports.fetchImageBuffer = fetchImageBuffer;
