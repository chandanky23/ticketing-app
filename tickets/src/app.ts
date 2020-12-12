import express from "express"
import "express-async-errors"
import { json } from "body-parser"
import cookieSession from "cookie-session"
import { errorHandler, NotFoundError } from "@ckytickets/common"

const app = express()
// We want express to trust our proxy coming over ingress-nginx using HTTPS
app.set("trust proxy", true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // Must be 'true' for prod for all HTTPS calls else false as the calls will be http
  })
)

app.all("*", async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
