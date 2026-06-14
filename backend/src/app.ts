import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { corsOrigin } from "./config/cors";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: corsOrigin,
  })
);
app.use(cookieParser());
app.use(express.json());


// ALL ROUTES
app.use("/api/v1/", router);


// Global error handler (MUST be after all routes)
app.use(globalErrorHandler);

app.get("/", (_, res) => {
  res.json({
    message: "Welcome to BookMyTheatre Backend",
  });
});

export default app;