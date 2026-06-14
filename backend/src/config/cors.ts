const LOCAL_DEV_ORIGIN = "http://localhost:5173";

export function getAllowedOrigins(): string[] {
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

export const corsOrigin = (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
) => {
    const allowed = getAllowedOrigins();

    if (!origin || allowed.includes(origin)) {
        callback(null, true);
        return;
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
};

export const socketCors = {
    origin: getAllowedOrigins(),
    methods: ["GET", "POST"],
    credentials: true,
};
