import { expressjwt } from 'express-jwt'
import { env } from '../../lib/env'
import type { Request } from 'express'

const getToken = async (req: Request) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1]
  }
  if (typeof req.query?.token === 'string') {
    return req.query.token
  }

  return ''
}

export const jwtMiddleware = expressjwt({
  secret: env.JWT_SECRET_KEY,
  algorithms: ['HS256'],
  getToken,
}).unless({
  path: ['/login', '/login-adm', '/webhook-hotmart', '/webhook-hotmart-latam'],
})
