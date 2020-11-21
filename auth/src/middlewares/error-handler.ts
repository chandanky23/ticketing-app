import { NextFunction, Request, Response } from "express"
import { CustomError } from "../errors/custom-errors"

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  }

  res.status(400).send({
    erros: [
      { message: "Something went wrong" }, // message sent with throw
    ],
  })
}
