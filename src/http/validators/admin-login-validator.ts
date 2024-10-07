import type { Request, Response, NextFunction } from 'express'
import { HttpStatusCode } from '../../types/http-status-code'

export const validateAdminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessCode, email, password } = req.body

  if (!email || !password || !accessCode) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Parâmetros inválidos.',
    })
  }

  if (typeof accessCode !== 'string' || accessCode.length < 3) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Código de acesso inválido.',
    })
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Email inválido.',
    })
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Senha inválida.',
    })
  }

  next()
}

function isValidDate(date: string): boolean {
  return !Number.isNaN(Date.parse(date))
}
