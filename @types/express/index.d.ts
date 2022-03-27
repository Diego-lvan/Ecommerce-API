import { Express, Request } from "express";
import { User } from "../../src/middlewares/auth";
declare global {
  namespace Express {
    export interface Request {
      user: string;
      exists: User;
    }
  }
}
