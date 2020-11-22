import { CustomError } from "./custom-errors"

export class NotAuthorizedError extends CustomError {
  statusCode = 401

  constructor() {
    super("User not authorized")

    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }

  serializeErrors() {
    return [
      {
        message: "User not authorized",
      },
    ]
  }
}
