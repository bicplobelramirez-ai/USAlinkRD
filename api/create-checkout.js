import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { type, membershipTier, cartItems, customerEmail, pedidoId } = req.body;

    let lineItems = [];
    let metadata = {};
    let successUrl = "https://us-alink-rd.vercel.app/?payment=success";
    let cancelUrl = "https://us-alink-rd.vercel.app/?payment=cancelled";

    if (type === "membership") {
      const MEMBERSHIP_PRICES = {
        silver: { name: "Membresía Silver", price: 999 },  // $9.99
        gold:   { name: "Membresía Gold",   price: 1999 }, // $19.99
        elite:  { name: "Membresía Elite",  price: 3999 }, // $39.99
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
    } else if (type === "pedido") {
      if (!pedidoId) return res.status(400).json({ error: "Falta pedidoId" });

      const { data: pedido, error } = await supabase
        .from("Pedidos")
        .select("*")
        .eq("id", pedidoId)
        .single();

      if (error || !pedido) {
        return res.status(404).json({ error: "Pedido no encontrado" });
      }

      const total = Number(pedido.Total_usd || pedido.Precio_usd || 0);
      if (!total) {
        return res.status(400).json({ error: "El pedido no tiene un total válido" });
      }

      lineItems = [{
        price_data: {
          currency: "usd",
          product_data: { name: pedido.Nombre_Producto || "Pedido USALINK" },
          unit_amount: Math.round(total * 100),
        },
        quantity: 1,
      }];

      metadata = { pedido_id: String(pedidoId) };
      successUrl = `https://us-alink-rd.vercel.app/pago.html?id=${pedidoId}&status=success`;
      cancelUrl = `https://us-alink-rd.vercel.app/pago.html?id=${pedidoId}&status=cancelled`;
    } else {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail || undefined,
      metadata,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

