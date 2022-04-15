import { Request, Response, Express, NextFunction } from "express";
import "dotenv/config";
import Stripe from "stripe";
import pool from "../config/conn";
import { validationResult } from "express-validator";
import { Product } from "./products";
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, { apiVersion: "2020-08-27" });
interface saleInfo {
  productID: number;
  quantity: number;
  price?: number;
  name?: string;
  subTotal: number;
}

const enoughProduct = (products: Product[]) => {
  return products.every((product: Product) => product.enoughStock === 1);
};

const createStripeSession = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ error: errors.array() });
  }
  let { successURL, cancelURL, sales }: { successURL: string; cancelURL: string; sales: any } = req.body;
  try {
    const userID: number = req.userID;
    const IDs = sales.map((sale: saleInfo) => sale.productID).join(",");
    const [[{ email }]]: any = await pool.query("SELECT email FROM user WHERE userID = ?", [userID]);
    //select products and check if there are enough stock
    const sqlStockInfo = sales.map((sale: saleInfo) => `WHEN ${sale.productID} THEN stock >= ${sale.quantity}`).join(" ");
    const sql = `SELECT CASE productID ${sqlStockInfo} END "enoughStock",price,name,stock FROM product WHERE productID IN (${IDs}) `;
    const [data]: any[] = await pool.query(sql);
    if (!enoughProduct(data)) return res.json({ error: "Not enough products" });

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
    res.status(400).json({ error });
  }
};

const insertSale = async (sales: saleInfo[], saleID: string, totalPrice: number, userID: number) => {
  const salesInfo = sales
    .map((sale: saleInfo) => `('${saleID}',${sale.productID},${sale.quantity},${sale.price! * sale.quantity},${userID}) `)
    .join(", ");
  await pool.query(`INSERT INTO sale (saleID,productID,quantity,subTotal,userID) VALUES ${salesInfo}`);
};

const handleWebHook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payloadString: string = JSON.stringify(req.body, null, 2);
    const header: string = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: process.env.STRIPE_RESTRICTED_KEY,
    });
    let event = await stripe.webhooks.constructEvent(payloadString, header, process.env.STRIPE_RESTRICTED_KEY);
    if (event.type === "checkout.session.completed") {
      const data: any = event.data.object;

      const saleID: string = data.id;
      await pool.query("UPDATE sale SET succeded = true WHERE saleID = ?", [saleID]);
      //update stock product
      const [saleInfo]: any[] = await pool.query("SELECT * FROM sale WHERE saleID = ? ", [data.id]);
      const updateData = saleInfo.map((sale: saleInfo) => `WHEN ${sale.productID} THEN stock - ${sale.quantity}`).join(" ");
      const sqlUpdateStock = `UPDATE product SET  stock  = CASE productID ${updateData} END WHERE productID IN (${saleInfo.map(
        (sale: saleInfo) => sale.productID
      )}) `;
      await pool.query(sqlUpdateStock);
      res.send();
    }
  } catch (e: any) {
    console.log(e);
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }
};

const getSingleSale = async (req: Request, res: Response) => {
  const saleID: string = req.params.saleID;
  const sql = "CALL getSales(?,NULL,NULL,NULL,NULL,NULL,NULL)";
  const [[data]]: any = await pool.query(sql, [saleID]);
  if (data.length === 0) return res.json({ error: "There is nothing here" });
  res.json({ sales: data });
};

const getSales = async (req: Request, res: Response) => {
  let { saleID, userID, productID, isDelivered, year, month, day }: any = req.query;
  saleID = saleID ? saleID : null;
  userID = isNaN(parseInt(userID)) ? null : parseInt(userID);
  productID = isNaN(parseInt(productID)) ? null : parseInt(productID);
  isDelivered = isDelivered === "true" ? true : null;
  year = isNaN(parseInt(year)) ? null : parseInt(year);
  month = isNaN(parseInt(month)) ? null : parseInt(month);
  day = isNaN(parseInt(day)) ? null : parseInt(day);

  const sql = "CALL getSales(?,?,?,?,?,?,?)";
  const [[data]]: any = await pool.query(sql, [saleID, userID, productID, isDelivered, year, month, day]);
  res.json({ sales: data });
};

const getMySales = async (req: Request, res: Response) => {
  const userID: number = req.userID;
  const sql = "CALL getSales(NULL,?,NULL,NULL,NULL,NULL,NULL)";
  const [[data]]: any = await pool.query(sql, userID);
  res.json({ sales: data });
};

export { createStripeSession, handleWebHook, getSingleSale, getSales, getMySales };
