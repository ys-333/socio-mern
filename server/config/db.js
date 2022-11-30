import mongoose, { mongo } from 'mongoose'

import dotenv from 'dotenv'

dotenv.config()

const dbConnect = function () {
  mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = mongoose.connection
  db.on('error', () => {
    console.log('CONNECTON FAILED')
  })
  db.once('open', () => {
    console.log('DATABASE CONNECTED')
  })
}

export default dbConnect
