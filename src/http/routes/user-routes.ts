import { Router } from 'express'
import { validateUser } from '../validators/user-validator'
import { HttpStatusCode } from '../../types/http-status-code'
import UserModel from '../../lib/db/models/user-model'
import { hash } from '../../lib/hash'
import { validateLogin } from '../validators/login-validaor'

const userRouter = Router()

userRouter.get('/users', async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.per_page) || 20

  try {
    const totalUsers = await UserModel.countDocuments()
    const totalPages = Math.ceil(totalUsers / limit)
    const skip = (page - 1) * limit

    if (page > totalPages) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ message: 'Página não encontrada.' })
    }

    const users = await UserModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ purchaseDate: -1 })

    res.status(HttpStatusCode.OK).json({
      users,
      currentPage: page,
      totalPages,
      totalUsers,
      hasMore: page < totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    })
  } catch {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: 'Erro ao buscar usuários',
    })
  }
})

userRouter.post('/login', validateLogin, async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await UserModel.findOne({ email })

    if (!user) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: 'Usuário não encontrado.',
        status: HttpStatusCode.NOT_FOUND,
      })
      return
    }

    res.json({
      message: 'Usuário logado com sucesso.',
      status: HttpStatusCode.OK,
      user: {
        name: user.name,
        email: user.email,
        expirationDate: user.expirationDate,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      })
    }

    res.json({
      message: 'Erro interno.',
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    })
  }
})

userRouter.post('/add-user', validateUser, async (req, res) => {
  const { name, email, password, purchaseDate, expirationDate } = req.body

  try {
    const userExists = await UserModel.findOne({ email })

    if (userExists) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: 'Usuário já existe.',
      })
    }

    const hashedPassword = await hash(password)

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      purchaseDate,
      expirationDate,
    })

    await newUser.save()

    res
      .status(HttpStatusCode.CREATED)
      .json({ user: newUser, status: HttpStatusCode.CREATED })
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: 'Erro ao criar usuário',
    })
  }
})

userRouter.delete('/delete-user/:id', async (req, res) => {
  const { id } = req.params

  await UserModel.findByIdAndDelete(id)

  res.status(HttpStatusCode.NO_CONTENT).json()
})

userRouter.put('/update-user/:id', async (req, res) => {
  const { id } = req.params
  const { name, email, purchaseDate, expirationDate } = req.body

  const user = await UserModel.findById(id)

  if (!user) {
    return res.json({
      message: 'Usuário não encontrado.',
      status: HttpStatusCode.NOT_FOUND,
    })
  }

  user.name = name || user.name
  user.email = email || user.email
  user.purchaseDate = purchaseDate || user.purchaseDate
  user.expirationDate = expirationDate || user.expirationDate

  await user.save()

  res.json({ user, status: HttpStatusCode.OK })
})

export default userRouter
