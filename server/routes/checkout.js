const express = require("express");
const { Order } = require("../models/order");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51PqaAV08AnOS0HgVK4TsO0LW6ArkdfuZNe6rhqYQi9PEgHuF6nDKUosW5XZbLytdk3rsqLfpg8M1i1w1Ef8IArNR00E16TsXNA"
);

router.post("/", async (req, res) => {
    const products = req.body.products;
  
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "VND",
        product_data: {
          name: product.productTitle?.substr(0, 30) + "...",
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));
  
    // Log the line items for debugging
    console.log("Line Items:", JSON.stringify(lineItems, null, 2));
  
    // Calculate the total amount
    const totalAmount = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  
    console.log(`Total amount: ${totalAmount}`); // Log the total amount
  
    const maxAmount = 99999999; // Maximum allowed amount in VND
  
    if (totalAmount > maxAmount) {
      console.error(`Total amount exceeds limit: ${totalAmount}`); // Log an error if the amount exceeds the limit
      return res.status(400).json({
        error: `Total amount exceeds the maximum limit of ₫99,999,999. Please reduce the quantity or remove some items.`,
      });
    }
  
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId,
        cart: JSON.stringify(lineItems),
      },
    });
  
    // Proceed with creating the session if the total amount is within the limit
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      phone_number_collection: {
        enabled: true,
      },
      customer: customer.id,
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["VN"],
      },
      success_url: `http://localhost:3000/payment/complete/{CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:3006/cancel",
    });
  
    res.json({ id: session.id });
  });
  
router.get("/payment/complete", async (req, res) => {
  const result = Promise.all([
    stripe.checkout.sessions.retrieve(req.query.session_id, {
      expand: ["payment_intent.payment_method"],
    }),
    stripe.checkout.sessions.listLineItems(req.query.session_id),
  ]);

  res.status(200).send(JSON.stringify(await result));
});

router.get("/cancel", (req, res) => {
  res.redirect("/");
});

module.exports = router;
