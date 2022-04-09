import * as jwt from "jsonwebtoken";
declare global {
  namespace jsonwebtoken {
    export interface JwtPayload {
      userID: number;
    }
  }
}

export {};
