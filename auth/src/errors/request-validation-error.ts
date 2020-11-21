import { ValidationError } from 'express-validator'

export class RequestValidationError extends Error {
  // this means this.errors = errors
  constructor(public errors: ValidationError[]) {
    super()

    // ONly because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }
}
