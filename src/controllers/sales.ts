import { Request, Response, Express, NextFunction } from "express";
import "dotenv/config";
import Stripe from "stripe";
import pool from "../config/conn";
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, { apiVersion: "2020-08-27" });
interface purchase {
  productID: number;
  quantity: number;
  price?: number;
  name?: string;
}

const createStripeSession = async (req: Request, res: Response) => {
  let { successURL, cancelURL, purchases } = req.body;
  try {
    const IDs = purchases.map((purchase: purchase) => purchase.productID || null).join(",");
    const [data]: any = await pool.query(`SELECT price,name FROM product WHERE productID IN (${IDs})`);
    purchases = purchases.map((purchase: purchase, i: number) => ({ price: data[i].price, name: data[i].name, ...purchase }));
    const session = await stripe.checkout.sessions.create({
      customer_email: "diego@gmail.com",
      payment_method_types: ["card"],
      mode: "payment",
      success_url: successURL,
      cancel_url: cancelURL,
      line_items: purchases.map((purchase: purchase) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: purchase.name,
            },
            unit_amount: purchase.price,
          },
          quantity: purchase.quantity,
        };
      }),
    });
    const checkout = session.id;
    const purchsesStr = purchases
      .map((purchase: purchase) => `('${checkout}',${purchase.productID},${1},${purchase.quantity})`)
      .join(", ");
    await pool.query(`INSERT INTO sale (checkout,productID,userID,amount) VALUES ${purchsesStr}`);
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json(error);
  }
};

const handleWebHook = async (req: Request, res: Response, next: NextFunction) => {
  const payloadString = JSON.stringify(req.body, null, 2);
  const header = stripe.webhooks.generateTestHeaderString({ payload: payloadString, secret: process.env.STRIPE_ENDPOINT_SECRET });
  let event;
  try {
    event = stripe.webhooks.constructEvent(payloadString, header, process.env.STRIPE_ENDPOINT_SECRET);
  } catch (e: any) {
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const data: any = event.data.object;
    const checkout = data.id;
    await pool.query("UPDATE sale SET succeded = true WHERE checkout = ?", [checkout]);
  }
  res.send();
};

export { createStripeSession, handleWebHook };
