import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models/tickets"
import mongoose from "mongoose"
import { response } from "express"

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "dfgh", price: 20 })
    .expect(404)
})
it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "dfgh", price: 20 })
    .expect(401)
})
it("returns a 401 if the user does not own a ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "hgfghj", price: 20 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "jhgfg",
      price: 30,
    })
    .expect(401)
})
it("returns a 400 if the user provided an invalid title or price", async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "hgfghj", price: 20 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "jhg",
      price: -20,
    })
    .expect(400)
})
it("updates the ticket provided valid inputs", async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "hgfghj", price: 20 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "test", price: 100 })
    .expect(200)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(ticketResponse.body.title).toEqual('test')
  expect(ticketResponse.body.price).toEqual(100)
})
