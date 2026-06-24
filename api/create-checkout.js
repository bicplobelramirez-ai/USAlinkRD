import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { type, membershipTier, cartItems, customerEmail } = req.body;

    let lineItems = [];

    if (type === "membership") {
      const MEMBERSHIP_PRICES = {
        silver: { name: "Membresía Silver", price: 999 },   // $9.99
        gold:   { name: "Membresía Gold",   price: 1999 },  // $19.99
        elite:  { name: "Membresía Elite",  price: 3999 },  // $39.99
      };
      const tier = MEMBERSHIP_PRICES[membershipTier];
      if (!tier) return res.status(400).json({ error: "Tier inválido" });

      lineItems = [{
        price_data: {
          currency: "usd",
          product_data: { name: tier.name },
          unit_amount: tier.price,
        },
        quantity: 1,
      }];
    } else if (type === "cart") {
      lineItems = cartItems.map(item => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
      }));
    } else {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail || undefined,
      success_url: "https://us-alink-rd.vercel.app/?payment=success",
      cancel_url:  "https://us-alink-rd.vercel.app/?payment=cancelled",
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
