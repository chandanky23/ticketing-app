import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { app } from "../app"
import request from "supertest"
import jwt from "jsonwebtoken"

jest.mock('../nats-wrapper')

let mongo: any

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[]
    }
  }
}

/**
 * Create a mongodb in memory server connection for doing db tests at the beginning of all the tests.
 */
beforeAll(async () => {
  process.env.JWT_KEY = "asffhf"
  mongo = new MongoMemoryServer()
  const mongoURI = await mongo.getUri()

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

// Delete all the data, i.e collections created in mongodb after each test.
beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signin = () => {
  // Build a JSON web token payload, { id, email }
  const id = mongoose.Types.ObjectId().toHexString()
  const payload = {
    id,
    email: "test@test.com",
  }

  // Create a JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build up our session object. {jwt: jst_data}
  const session = { jwt: token }

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  // Take JSOn and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64")

  // Return a string that the cookie with the encoded data
  return [`express:sess=${base64}`]
}
