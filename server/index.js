import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import dbConnect from './config/db.js'
import { register } from './controllers/auth.js'
import { createPost } from './controllers/post.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import postRoutes from './routes/post.js'
import { verifyToken } from './middleware/auth.js'
import User from './models/User.js'
import Post from './models/Post.js'
import { users, posts } from './data/index.js'

/* CONFIGURATIONS*/

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

/*FILE STORAGE*/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

/*ROUTES WITH FILES */
// ! WE add register here as we have configured multer in index.js file

app.post('/auth/register', upload.single('picture'), register)
app.post('/post', verifyToken, upload.single('picture', createPost))

/*ROUTES*/
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/post', postRoutes)

/*DATABASE CONNECTON AND SERVER CONNECTON*/
dbConnect()
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Listening on server ${PORT}`)
  // User.insertMany(users)
  // Post.insertMany(posts)
})
