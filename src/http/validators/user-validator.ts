import type { Request, Response, NextFunction } from 'express'
import { HttpStatusCode } from '../../types/http-status-code'

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, purchaseDate, expirationDate } = req.body

  if (!name || !email || !purchaseDate || !expirationDate) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Parâmetros inválidos.',
    })
  }

  if (typeof name !== 'string' || name.length < 3) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Nome inválido.',
    })
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Email inválido.',
    })
  }

  if (typeof purchaseDate !== 'string' || !isValidDate(purchaseDate)) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Data de compra inválida.',
    })
  }

  if (typeof expirationDate !== 'string' || !isValidDate(expirationDate)) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Data de expiração inválida.',
    })
  }

  next()
}

function isValidDate(date: string): boolean {
  return !Number.isNaN(Date.parse(date))
}
