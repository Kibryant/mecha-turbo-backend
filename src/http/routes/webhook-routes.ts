import { Router } from 'express'
import { HttpStatusCode } from '../../types/http-status-code'
import { env } from '../../lib/env'
import type { DataWebhookHotmart } from '../../types/data-webhook-hotmart'
import UserModel from '../../lib/db/models/user-model'

const webhookRouter = Router()

webhookRouter.post('/webhook-hotmart', async (req, res) => {
  const hotmartReceivedHottok = req.headers['x-hotmart-hottok']

  if (hotmartReceivedHottok !== env.HOTMART_HOTTOK) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: 'Hottok inválido.',
      status: HttpStatusCode.UNAUTHORIZED,
    })
  }

  const { data }: DataWebhookHotmart = req.body

  const { buyer } = data

  const { name, email } = buyer

  const purchaseDate = new Date()

  const expirationDate = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  )

  try {
    const userExists = await UserModel.findOne({ email })

    if (userExists) {
      return res.status(HttpStatusCode.CONFLICT).json({
        message: 'Usuário já cadastrado.',
        status: HttpStatusCode.CONFLICT,
      })
    }

    const newUser = await UserModel.create({
      name,
      email,
      password: env.SECRET_PASSWORD,
      purchaseDate,
      expirationDate,
    })

    await newUser.save()

    return res
      .status(HttpStatusCode.CREATED)
      .json({ user: newUser, status: HttpStatusCode.CREATED })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      })
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: 'Erro interno.',
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    })
  }
})

export default webhookRouter
