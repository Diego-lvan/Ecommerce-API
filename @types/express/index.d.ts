import { Express, Request, Response } from "express";
import { User } from "../../src/middlewares/auth";
declare global {
  namespace Express {
    export interface Request {
      userID: number;
      exists: User;
      isAdmin: boolean;
      email: string;
    }
    export interface Response {
      results: any;
      info: {
        count: number;
        pages: number;
        next: null | string;
        prev: null | string;
      };
    }
  }
}
