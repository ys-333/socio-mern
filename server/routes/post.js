import express, { Router } from 'express'
import { verifyToken } from '../middleware/auth'
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
} from '../controllers/post.js'

const router = express.Router()

/*READ*/

// router.get('/', verifyToken, getFeedPosts)
router.get('/:userId/posts', verifyToken, getUserPosts)
/*UPDATE*/
// router.patch('/:id/like', verifyToken, likePost)

/*DELETE*/

// router.delete('/delete', verifyToken, deletePost)

export default Router
