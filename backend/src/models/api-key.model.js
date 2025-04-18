import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: Date,
    type: {
      type: String,
      enum: ["testing", "production"],
      required: true,
    },

    // scopes: [String], // e.g., ['products:read', 'users:read']
    isActive: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const ApiKey = mongoose.model("ApiKey", apiKeySchema);
