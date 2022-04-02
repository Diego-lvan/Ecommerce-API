import { Request, Response } from "express";
import "dotenv/config";
import Stripe from "stripe";
import pool from "../config/conn";
console.log(process.env.STRIPE_PRIVATE_KEY);
const test = new Stripe(process.env.STRIPE_PRIVATE_KEY!, { apiVersion: "2020-08-27" });
interface purchase {
  productID: number;
  quantity: number;
  price?: number;
  name?: string;
}

const createStripeSession = async (req: Request, res: Response) => {
  let { successURL, cancelURL, purchases } = req.body;

  const IDs = purchases.map((purchase: purchase) => purchase.productID || null).join(",");
  const [data]: any = await pool.query(`SELECT price,name FROM product WHERE productID IN (${IDs})`);
  purchases = purchases.map((purchase: purchase, i: number) => ({ price: data[i].price, name: data[i].name, ...purchase }));
  const session = await test.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: "https://www.youtube.com/watch?v=1r-F3FIONl8&t=975s",
    cancel_url: "https://www.youtube.com/watch?v=1r-F3FIONl8&t=975s",
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
  console.log(session.url);

  res.json({ url: session.url });
};

export { createStripeSession };
