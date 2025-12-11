import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: { type: Number, required: true },     
    price: { type: Number, required: true },

    // optional cached info (avoids extra DB calls)
    title: String,
    image: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [orderItemSchema],

    total: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },

    fulfillmentStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing"
    },

    address: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
