import Post from '../models/Post'
import User from '../models/User'

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body
    const user = await User.findById(userId)
    const firstName = user.firstName
    const lastName = user.lastName
    const location = user.location
    const userPicturePath = user.picturePath

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
    console.log(post)
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
