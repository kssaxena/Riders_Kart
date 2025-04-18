import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each API key to 100 requests per windowMs
  keyGenerator: (req) => req.headers["x-api-key"] || req.query.apiKey,
  message: "Too many requests from this API key, please try again later",
});

export default apiLimiter;
