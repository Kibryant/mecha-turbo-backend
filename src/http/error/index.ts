import type { Request, Response, NextFunction } from 'express'
import { HttpStatusCode } from '../../types/http-status-code'
import type { UnauthorizedError } from 'express-jwt'

export const error = (
  err: UnauthorizedError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === 'UnauthorizedError') {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ message: 'Token inválido ou expirado.' })
  }

  if (err instanceof Error) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: err.message,
    })
  }

  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    message: 'Erro interno no servidor.',
  })
}
