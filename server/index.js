import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import dbConnect from "./config/db.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/post.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import { getFeedPosts } from "./controllers/post.js";
import obj from "./config/cloudinary.js";
import fs from "fs";

/* CONFIGURATIONS*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan('common'))
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/*FILE STORAGE*/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// const upload = multer({ storage: obj.storage })

/*ROUTES WITH FILES */
// ! WE add register here as we have configured multer in index.js file

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
// app.post('/posts', verifyToken, upload.single('picture'), async (req, res) => {
//   try {
//     const { userId, description } = req.body
//     const user = await User.findById(userId)
//     const firstName = user.firstName
//     const lastName = user.lastName
//     const location = user.location
//     const userPicturePath = user.picturePath

//     // Upload the file to Cloudinary
//     // const uploadResult = await cloudinary.v2.uploader.upload(req.file.path)
//     const uploadResult = await obj.cloudinary.v2.uploader.upload(req.file.path)
//     // Get the URL of the uploaded image
//     const picturePath = uploadResult.secure_url

//     console.log(picturePath, 'lsjfasjf dsjf ')

//     const newPost = new Post({
//       userId,
//       firstName,
//       lastName,
//       location,
//       userPicturePath,
//       description,
//       picturePath,
//       likes: {},
//       comments: [],
//     })

//     // await newPost.save()

//     const post = await Post.find()
//     res.status(201).json(post)
//   } catch (err) {
//     res.status(409).json({ err: err.message })
//   }
// })

// routes to get all post
// written here insted of controllers/routes folder, as to deal with preflight request
app.get("/posts", verifyToken, async (req, res) => {
  const posts = await Post.find();

  res.status(200).json(posts);
});

// to like post, same issue as we face in above routes

app.patch("/posts/:id/like", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  console.log("like post or remove post");
  const post = await Post.findById(id);
  const isLiked = post.likes.get(userId);

  if (isLiked) {
    post.likes.delete(userId);
  } else {
    post.likes.set(userId, true);
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { likes: post.likes },
    { new: true }
  );

  res.status(200).json(updatedPost);
});

app.delete("/posts/delete", verifyToken, async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);

    const { picturePath } = post;

    console.log(picturePath);

    if (picturePath) {
      const filePath = `public/assets/${picturePath}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        } else {
          console.log("Deleted sucessfully");
        }
      });
    }

    await Post.findByIdAndDelete(postId);

    const posts = await Post.find();

    return res.status(200).json({ posts });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

/*ROUTES*/
app.use("/auth", authRoutes); //authroutes
app.use("/user", userRoutes); //user routes
app.use("/posts", postRoutes); //postroutes

/*DATABASE CONNECTON AND SERVER CONNECTON*/
dbConnect();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on server ${PORT}`);
  // User.insertMany(users)
  // Post.insertMany(posts)
});
