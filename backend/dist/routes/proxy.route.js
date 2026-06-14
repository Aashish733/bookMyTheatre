"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageProxy_1 = require("../utils/imageProxy");
const router = (0, express_1.Router)();
router.get("/proxy-image", async (req, res, next) => {
    try {
        const url = req.query.url;
        if (typeof url !== "string" || !url.trim()) {
            res.status(400).json({ success: false, message: "Missing image URL" });
            return;
        }
        const { buffer, contentType } = await (0, imageProxy_1.fetchImageBuffer)(url);
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "public, max-age=3600");
        res.send(buffer);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
