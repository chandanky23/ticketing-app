import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { app } from "../app"

let mongo: any

/**
 * Create a mongodb in memory server connection for doing db tests at the beginning of all the tests.
 */
beforeAll(async () => {
  process.env.JWT_KEY = 'asffhf'
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
