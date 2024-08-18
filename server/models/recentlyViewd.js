const mongoose = require("mongoose");

const recentlyViewdSchema = mongoose.Schema({
  prodId: {
    type: String,
    default: "",
  },
  name: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  brand: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  oldPrice: {
    type: Number,
    default: 0,
  },
  catName: {
    type: String,
    default: "",
  },
  subCatId: {
    type: String,
    default: "",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  discount: {
    type: Number,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  specifications: {
    type: Map,
    of: String,
  },
});

recentlyViewdSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

recentlyViewdSchema.set("toJSON", {
  virtuals: true,
});

exports.RecentlyViewd = mongoose.model("RecentlyViewd", recentlyViewdSchema);


// 11111