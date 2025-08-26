import mongoose, { Schema } from "mongoose";

const StepSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
      number: {
        type: Number,
        required: true,
        trim: true,
      },
      pickup: {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
      },
      address: {
        type: String,
        required: true,
      },
      houseNo: {
        type: String,
      },
    },

    receiver: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
      number: {
        type: Number,
        required: true,
        trim: true,
      },
      drop: {
        // lat: {
        //   type: Number,
        //   required: true,
        // },
        // long: {
        //   type: Number,
        //   required: true,
        // },

        type: { type: String, enum: ["Point"], required: true },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
      },
      address: {
        type: String,
        required: true,
      },
      houseNo: {
        type: String,
      },
    },

    vehicle: {
      type: String,
      required: true,
    },

    productDetails: {
      productType: {
        type: String,
        required: true,
      },
      productWeight: {
        type: Number,
        required: true,
      },
      Dimension: {
        length: {
          type: Number,
          required: true,
        },
        width: {
          type: Number,
          required: true,
        },
        height: {
          type: Number,
          required: true,
        },
      },
      value: {
        type: Number,
        required: true,
      },
    },

    deliveryPartner: {
      type: Schema.Types.ObjectId,
      ref: "DeliveryPartner",
    },

    // TODO: check the required fields after implementation
    expectedDeliveryDate: {
      type: Date,
    },

    // TODO: check the required fields after implementation
    totalAmount: {
      type: Number,
    },

    status: {
      type: String,
      required: true,
      lowercase: true,
    },

    tracking: {
      current: {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
      },
      steps: {
        type: [StepSchema], // ✅ new tracking steps field
        default: [
          {
            title: "Order Placed",
            status: "completed",
            completed: true,
            timestamp: Date.now(),
          },
          { title: "Picked Up", status: "pending" },
          { title: "In Transit", status: "pending" },
          { title: "Out for Delivery", status: "pending" },
          { title: "Delivered", status: "pending" },
        ],
      },
    },

    paymentStatus: {
      type: String,
      lowercase: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ senderLocation: "2dsphere" }); // Geospatial index
orderSchema.index({ receiverLocation: "2dsphere" }); // Optional if you
orderSchema.index({ "tracking.current": "2dsphere" });
// need to search by receiver

export const Order = mongoose.model("Order", orderSchema);
