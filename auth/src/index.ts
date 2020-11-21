import express from "express"
import { json } from "body-parser"

import { currentUserRouter } from "./routes/currentUser"
import { signInRouter } from "./routes/siginin"
import { signUpRouter } from "./routes/signup"
import { signOutRouter } from "./routes/signout"
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

const app = express()
app.use(json())

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signUpRouter)
app.use(signOutRouter)

app.all('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)

app.listen(3000, () => console.log("listening on port 3000!"))
