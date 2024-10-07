import express from 'express'
import cors from 'cors'
import adminRouter from './routes/admin-routes'
import webhookRouter from './routes/webhook-routes'
import userRouter from './routes/user-routes'

import { connect } from '../lib/db/connect'
import { server } from '../lib/server'
import { env } from '../lib/env'
import { jwtMiddleware } from './middleware'
import { error } from './error'

const MONGODB_URI = env.MONGODB_URI

connect(MONGODB_URI)

server.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }))

server.use(express.json())

server.use(jwtMiddleware)

server.use(userRouter)
server.use(adminRouter)
server.use(webhookRouter)

server.use(error)

server.listen(env.PORT).on('listening', () => {
  console.log(`Server is running on port ${env.PORT}`)
})
