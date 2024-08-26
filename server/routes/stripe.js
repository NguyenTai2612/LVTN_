const express = require("express");
const { Order } = require("../models/order");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51PqaAV08AnOS0HgVK4TsO0LW6ArkdfuZNe6rhqYQi9PEgHuF6nDKUosW5XZbLytdk3rsqLfpg8M1i1w1Ef8IArNR00E16TsXNA"
);

// Create Order
const createOrder = async (customer, data) => {
  const Items = JSON.parse(customer.metadata.cart);

  // Lấy userId từ mục đầu tiên trong giỏ hàng
  const userId = Items.length > 0 ? Items[0].userId : null;

  if (!userId) {
    console.log("UserId is missing in cart items");
    return;
  }

  const newOrder = new Order({
    userId: userId, // Sử dụng userId từ giỏ hàng
    customerId: data.customer,
    products: Items.map((item) => ({
      productTitle: item.productTitle,
      image: item.image,
      brand: item.brand,
      quantity: item.quantity,
      subTotal: item.subTotal,
      price: item.price,
      productId: item.productId,
      userId: item.userId,
    })),
    subTotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
    date: new Date(),
  });

  try {
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log("Order creation failed:", err);
  }
};

router.get(`/`, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 16; // Allow perPage to be set via query
    const totalPosts = await Order.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({ message: "No data found" });
    }

    const odrderList = await Order.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!odrderList.length) {
      return res
        .status(404)
        .json({ success: false, message: "No order found." });
    }
    return res.status(200).json({
      odrderList,
      totalPages,
      page,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ message: "The order with the given ID was not found." });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        "shipping.address.city": req.body.address.city, // Updating nested address field
        phone: req.body.phone,
        customerId: req.body.customerId,
        userId: req.body.userId,
        products: req.body.products,
        total: req.body.total,
        payment_status: req.body.payment_status,
        deliver_status: req.body.deliver_status,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not update!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully!",
      updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/create-checkout-session", async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      // Giảm kích thước của dữ liệu trong metadata
      cart: JSON.stringify(
        req.body.cartItems.map((item) => ({
          productTitle: item.productTitle,
          image: item.image,
          brand: item.brand,
          quantity: item.quantity,
          price: item.price,
          userId: item.userId,
          // productId: item.productId,
        }))
      ),
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "VND",
        product_data: {
          name: item.productTitle,
          images: [item.image],
          metadata: {
            id: item.id,
            brand: item.brand,
          },
        },
        unit_amount: item.subTotal,
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["VN"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "VND",
          },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 100000,
            currency: "VND",
          },
          display_name: "Next day air",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    customer: customer.id,
    line_items,
    mode: "payment",
    success_url: "http://localhost:3000/checkout-success",
    cancel_url: "http://localhost:3000/cart",
  });

  res.send({ url: session.url });
});

let endpointSecret;

// endpointSecret =
//   "whsec_28ece195885ee5c69b38089c5de04d2cd3bd32b51bdb2df6ad1dc50657a070b7";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let data;
    let eventType;

    if (endpointSecret) {
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("Webhooks verifired");
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);

        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          createOrder(customer, data);
        })
        .catch((err) => console.log(err.message));
    }

    res.send().end();
  }
);

module.exports = router;

// stripe listen --forward-to localhost:4000/api/stripe/webhook
// stripe trigger payment_intent.succeeded
// edit
