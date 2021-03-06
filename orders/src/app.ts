import express from "express"
import "express-async-errors"
import { json } from "body-parser"
import cookieSession from "cookie-session"
import { errorHandler, NotFoundError, currentUser } from "@ckytickets/common"
import { createOrderRouter } from "./routes/createOrder"
import { deleteOrderRouter } from "./routes/deleteOrder"
import { getAllOrdersRouter } from "./routes/getAllOrders"
import { getOrderRouter } from "./routes/getOrder"
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
app.use(currentUser)

app.use(createOrderRouter)
app.use(deleteOrderRouter)
app.use(getAllOrdersRouter)
app.use(getOrderRouter)

app.all("*", async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
