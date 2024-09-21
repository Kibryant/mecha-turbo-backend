import mongoose from 'mongoose'

async function connect(MONGODB_URI: string) {
  try {
    const opts = {}

    const connection = await mongoose.connect(MONGODB_URI, opts)

    return connection
  } catch (error) {
    console.log(error)
  }
}

export { connect }
