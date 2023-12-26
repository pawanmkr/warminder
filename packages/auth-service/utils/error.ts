import { Response } from "express";

export async function errorInResponse(res: Response, httpStatusCode: number, errorMessage: string): Promise<Response> {
  return res.status(httpStatusCode).json({
    message: errorMessage
  });
}