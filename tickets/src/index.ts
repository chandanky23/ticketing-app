import mongoose from "mongoose"
import { app } from "./app"

// Connection to mongodb, db name is defined in srv file in k8s , i.e, auth-mongo-depl.yaml
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined")
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log("connected to MongoDb")
  } catch (err) {
    console.error(err)
  }
}

app.listen(3000, () => console.log("listening on port 3000!!"))

start()