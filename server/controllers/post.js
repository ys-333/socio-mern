import Post from '../models/Post'
import User from '../models/User'

import fs from 'fs'

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body
    const user = await User.findById(userId)
    const firstName = user.firstName
    const lastName = user.lastName
    const location = user.location
    const userPicturePath = user.picturePath

    console.log(req.file)

    const newPost = new Post({
      userId,
      firstName,
      lastName,
      location,
      userPicturePath,
      description,
      picturePath,
      likes: {},
      comments: [],
    })

    await newPost.save()

    const post = await Post.find()
    res.status(201).json(post)
  } catch (err) {
    res.status(409).json({ err: err.message })
  }
}

/*READ*/

export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find()

    res.status(200).json(post)
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const post = await Post.find({ userId: userId })
    res.status(200).json(post)
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
}

/*UPDATE*/

export const likePost = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    console.log('like post or remove post')
    const post = await Post.findById(id)
    const isLiked = post.likes.get(userId)

    if (isLiked) {
      post.likes.delete(userId)
    } else {
      post.likes.set(userId, true)
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true },
    )

    res.status(200).json(updatedPost)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

/*DELETE*/

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.body
    const post = await Post.findById(postId)

    const { picturePath } = post

    if (picturePath) {
      fs.unlink(picturePath, (err) => {
        if (err) {
          return res.status(500).json({ message: err.message })
        } else {
          console.log('Deleted sucessfully')
        }
      })
    }

    await Post.findByIdAndDelete(postId)

    const Posts = await Post.find()

    return rmSync.status(200).json({ post })
  } catch (err) {
    return res.status(404).json({ message: err.message })
  }
}
