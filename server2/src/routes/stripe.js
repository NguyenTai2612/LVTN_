const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51PfzQgFid1mHvFGHk3qPaC3xbdkdChl7llJDatD1Eqei3lzCHEDtLwVGOw0QGLkUACHIyCIuDEqGGf4kgpJ107LA005cNvcv7o"
);

require("dotenv").config();

router.post("/create-checkout-session", async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
    },
  });

  console.log(req.body.cartData);
  const line_items = req.body.cartData.map((item) => {
    return {
      price_data: {
        currency: "vnd",
        product_data: {
          name: item.Product.name,
          metadata: {
            id: item.product_id,
          },
        },
        unit_amount: item.subTotal,
      },
      quantity: item.quantity || 1,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    customer: customer.id,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cart",
  });

  res.send({ url: session.url });
});

// Stripe webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.

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
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          endpointSecret
        );
        console.log("Webhook verified.");
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

    // Handle the event

    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          console.log(customer);
          console.log("data:", data);
        })
        .catch((err) => console.log(err.message));
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send().end();
  }
);

module.exports = router;
