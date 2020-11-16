import express, { Request, Response } from 'express'

const router = express.Router()

router.get('/api/users/currentUser', (req: Request, res: Response) => {
  res.send('Hello from current user')
})

export { router as currentUserRouter }