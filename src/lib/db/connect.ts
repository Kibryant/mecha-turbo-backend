import mongoose from 'mongoose'

async function connect(MONGODB_URI: string) {
  try {
    const opts = {}

    const connection = await mongoose.connect(MONGODB_URI, opts)

    return connection
  } catch (error) {
    throw new Error("Couldn't connect to the database.")
  }
}

export { connect }
