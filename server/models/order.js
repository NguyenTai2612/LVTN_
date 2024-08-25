const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
  },
  products: [
    {
      id: { type: String },
      productTitle: { type: String },
      brand: { type: String },
      image: { type: String },
      rating: { type: Number },
      price: { type: Number },
      quantity: { type: Number },
      productId: { type: String },
      userId: { type: String },
    },
  ],

  subTotal: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  shipping: {
    type: Object,
    required: true,
  },
  deliver_status: {
    type: String,
    default: "pending",
  },
  payment_status: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

exports.Order = mongoose.model("Order", orderSchema);
exports.orderSchema = orderSchema;
