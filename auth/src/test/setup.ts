import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { app } from "../app"
import request from 'supertest'

let mongo: any

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>
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
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

// using a global signin function and making it Global to avoid importing in all the test cases.
// This function will only be applicable to the App in test env.
global.signin = async () => {
  const email = "test@test.com"
  const password = "password"

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201)

  const cookie = response.get('Set-Cookie')
  return cookie
}
