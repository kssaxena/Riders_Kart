// middleware/apiKeyAuth.js
import { ApiKey } from "../models/api-key.model.js";
import { ApiError } from "../utils/ApiError.js";

async function apiKeyAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"] || req.query.apiKey;

  if (!apiKey) {
    throw new ApiError(401, "API key required");
  }

  try {
    const keyDoc = await ApiKey.findOne({
      key: apiKey,
      isActive: true,
      status: "approved",
    }).populate("user", "-password -__v");

    if (!keyDoc) {
      throw new ApiError(403, "Invalid API key");
    }

    if (keyDoc.expiresAt && new Date() > keyDoc.expiresAt) {
      throw new ApiError(403, "API key expired");
    }

    // Attach key info to request for later use
    req.apiKey = keyDoc;
    next();
  } catch (error) {
    console.error("API key validation error:", error);
    res.status(500).json(new ApiError(500, "Internal server error", error));
  }
}

export default apiKeyAuth;
