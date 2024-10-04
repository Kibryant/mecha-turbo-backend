import mongoose from 'mongoose'

const { Schema } = mongoose

const adminSchema = new Schema(
  {
    accessCode: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true, collection: 'admin' }
)

const AdminModel = mongoose.models.admin || mongoose.model('admin', adminSchema)

export default AdminModel
