import mongoose from 'mongoose'

const { Schema } = mongoose

const THIRTY_DAYS_IN_SECOND = 2592000

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    purchaseDate: { type: Date, required: true, default: Date.now },
    expirationDate: {
      type: Date,
      required: true,
      default: () =>
        new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  },
  { timestamps: true, collection: 'user' }
)

userSchema.index(
  { expirationDate: 1 },
  { expireAfterSeconds: THIRTY_DAYS_IN_SECOND }
)

const UserModel = mongoose.models.User || mongoose.model('User', userSchema)

export default UserModel
