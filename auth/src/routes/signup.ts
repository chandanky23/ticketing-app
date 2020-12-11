import express, { Request, Response } from "express"
import { body } from "express-validator"
import jwt from "jsonwebtoken"
import { BadRequestError, validateRequest } from "@ckytickets/common"
import { User } from "../models/user"

const router = express.Router()

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new BadRequestError("Email in use")
    }

    const user = User.build({
      email,
      password,
    })

    await user.save()

    // Generate json web token
    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! // env created using k8s
    )

    // store it on the session object
    req.session = {
      jwt: userJWT,
    }

    res.status(201).send(user)
  }
)

export { router as signUpRouter }
