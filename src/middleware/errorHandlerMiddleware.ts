import { NextFunction, Request, Response } from "express";

export class customError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
  }

  static badRequest(message: string) {
    return new customError(400, message);
  }

  static notFound(message: string) {
    return new customError(400, message);
  }

  static internal(message: string) {
    return new customError(500, message);
  }

  static forbidden(message: string) {
    return new customError(403, message);
  }
}

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof customError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: "Unexpected error" });
};
