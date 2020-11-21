import express from "express"
import 'express-async-errors'
import { json } from "body-parser"
import mongoose from 'mongoose'

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

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

// Connection to mongodb, db name is defined in srv file in k8s , i.e, auth-mongo-depl.yaml
const start = async () => {
  try{
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('connected to MongoDb')
  } catch(err) {
    console.error(err)
  }
}

app.listen(3000, () => console.log("listening on port 3000!!"))

start()