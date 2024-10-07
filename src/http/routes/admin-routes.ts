import { Router } from 'express'
import jwt from 'jsonwebtoken'
import AdminModel from '../../lib/db/models/admin-model'
import { compareHash, hash } from '../../lib/hash'
import { HttpStatusCode } from '../../types/http-status-code'
import { validateAdminLogin } from '../validators/admin-login-validator'
import { env } from '../../lib/env'

const adminRouter = Router()

adminRouter.post('/login-adm', validateAdminLogin, async (req, res) => {
  const { email, password, accessCode } = req.body

  try {
    const admin = await AdminModel.findOne({ email })
    if (
      !admin ||
      !(await compareHash(password, admin.password)) ||
      !(await compareHash(accessCode, admin.accessCode))
    ) {
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ message: 'Credenciais inválidas.' })
    }

    const token = jwt.sign({ email }, env.JWT_SECRET_KEY)
    res
      .status(HttpStatusCode.OK)
      .json({ message: 'Administrador logado com sucesso.', token })
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: 'Erro ao logar administrador' })
  }
})

adminRouter.put('/update-admin', async (req, res) => {
  const { oldEmail, email, password, accessCode } = req.body

  try {
    const admin = await AdminModel.findOne({ email: oldEmail })
    if (!admin) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ message: 'Administrador não encontrado.' })
    }

    admin.email = email || admin.email
    admin.password = password ? await hash(password) : admin.password
    admin.accessCode = accessCode ? await hash(accessCode) : admin.accessCode

    await admin.save()
    res
      .status(HttpStatusCode.OK)
      .json({ message: 'Administrador atualizado com sucesso!' })
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: 'Erro ao atualizar administrador' })
  }
})

export default adminRouter
