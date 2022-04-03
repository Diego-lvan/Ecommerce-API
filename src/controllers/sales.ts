import { Request, Response, Express, NextFunction } from "express";
import "dotenv/config";
import Stripe from "stripe";
import pool from "../config/conn";
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, { apiVersion: "2020-08-27" });
interface saleInfo {
  productID: number;
  quantity: number;
  price?: number;
  name?: string;
  subtotal?: number;
}

interface sale {
  date: string;
  delivered: boolean;
  totalPrice: number;
  userID: number;
}

const createStripeSession = async (req: Request, res: Response) => {
  let { successURL, cancelURL, sales }: { successURL: string; cancelURL: string; sales: any } = req.body;
  try {
    const userID: number = req.userID;
    const IDs = sales.map((sale: saleInfo) => sale.productID).join(",");
    const [[{ email }]]: any = await pool.query("SELECT email FROM user WHERE userID = ?", [userID]);
    const [data]: any = await pool.query(`SELECT price,name FROM product WHERE productID IN (${IDs})`);
    sales = sales.map((sale: saleInfo, i: number) => ({ price: data[i].price, name: data[i].name, ...sale }));
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ["card"],
      mode: "payment",
      success_url: successURL,
      cancel_url: cancelURL,
      line_items: sales.map((sale: saleInfo) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: sale.name,
            },
            unit_amount: sale.price,
          },
          quantity: sale.quantity,
        };
      }),
    });
    const saleID: string = session.id;
    await insertSale(sales, saleID, session.amount_total!, userID);
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json(error);
  }
};

const insertSale = async (sales: saleInfo[], saleID: string, totalPrice: number, userID: number) => {
  const salesInfo = sales
    .map((sale: saleInfo) => `('${saleID}',${sale.productID},${sale.quantity},${sale.price! * sale.quantity}) `)
    .join(", ");
  await pool.query(`INSERT INTO sale (saleID,userID,totalPrice) VALUES (?,?,?)`, [saleID, userID, totalPrice]);
  await pool.query(`INSERT INTO saleInfo (saleID, productID,quantity,subtotal) VALUES ${salesInfo} `);
};

const handleWebHook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payloadString: string = JSON.stringify(req.body, null, 2);
    const header: string = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: process.env.STRIPE_ENDPOINT_SECRET,
    });
    let event = await stripe.webhooks.constructEvent(payloadString, header, process.env.STRIPE_ENDPOINT_SECRET);
    if (event.type === "checkout.session.completed") {
      const data: any = event.data.object;
      const saleID: string = data.id;
      await pool.query("UPDATE sale SET succeded = true WHERE saleID = ?", [saleID]);
      res.send();
    }
  } catch (e: any) {
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }
};

const getSingleSale = async (req: Request, res: Response) => {
  const saleID: string = req.params.saleID;
  const sql = "CALL getSaleByID(?)";
  const [data]: any = await pool.query(sql, [saleID]);
  if (data[0].length === 0) return res.json({ error: "There is nothing here" });
  const sale: sale = data[0][0];
  const saleInfo: saleInfo = data[1];
  sale.delivered = sale.delivered ? true : false;
  res.json({ sale: data[0][0], saleInfo });
};

export { createStripeSession, handleWebHook, getSingleSale };
