import { Router, Request, Response, NextFunction } from "express";
import { fetchImageBuffer } from "../utils/imageProxy";

const router = Router();

router.get("/proxy-image", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const url = req.query.url;

    if (typeof url !== "string" || !url.trim()) {
      res.status(400).json({ success: false, message: "Missing image URL" });
      return;
    }

    const { buffer, contentType } = await fetchImageBuffer(url);

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

export default router;
