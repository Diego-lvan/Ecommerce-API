import { NextFunction, Request, Response } from "express";

const handleErrors = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error) res.status(500).json({ error: error.message });
};
export default handleErrors;
