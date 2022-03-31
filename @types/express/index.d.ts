import { Express, Request, Response } from "express";
import { User } from "../../src/middlewares/auth";
declare global {
  namespace Express {
    export interface Request {
      user: string;
      exists: User;
      isAdmin: boolean;
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
