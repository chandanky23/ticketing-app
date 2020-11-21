import { ValidationError } from "express-validator"
import { CustomError } from "./custom-errors"

export class RequestValidationError extends CustomError {
  statusCode = 400
  // this means this.errors = errors
  constructor(public errors: ValidationError[]) {
    super('Invalid parameters, validation failed')

    // ONly because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return {
        message: err.msg,
        field: err.param,
      }
    })
  }
}