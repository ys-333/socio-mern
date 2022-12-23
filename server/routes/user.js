import express from 'express'
import { verifyToken } from '../middleware/auth'
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  addSocialHandle,
} from '../controllers/user.js'

const router = express.Router()

/*READ*/

router.get('/:id', verifyToken, getUser)
router.get('/:id/friends', verifyToken, getUserFriends)

/*UPDATE*/
router.patch('/:id/:friendId', verifyToken, addRemoveFriend)

/*ADD SOCIAL HANDLE OF USER*/
router.post('/social/:userId', verifyToken, addSocialHandle)

export default router
