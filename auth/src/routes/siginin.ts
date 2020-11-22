import express, { Request, Response } from "express"
import { body } from "express-validator"
import { validateRequest } from "../middlewares/validate-request"
import { User } from "../models/user"
import { BadRequestError } from "../errors/bad-request-error"
import { PasswordManager } from "../services/password-manager"
import jwt from "jsonwebtoken"

const router = express.Router()

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").trim().notEmpty().withMessage("Password cannot be empty"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials")
    }

    const isMatchingPassoword = await PasswordManager.compare(
      existingUser.password,
      password
    )
    if (!isMatchingPassoword) {
      throw new BadRequestError("Invalid credentials")
    }

    // Generate json web token
    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY! // env created using k8s
    )

    // store it on the session object
    req.session = {
      jwt: userJWT,
    }

    res.status(200).send(existingUser)
  }
)

export { router as signInRouter }
