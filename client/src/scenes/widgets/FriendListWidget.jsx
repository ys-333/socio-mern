import { useEffect } from 'react'
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material'
import Friend from '../../components/Friend'
import { useDispatch, useSelector } from 'react-redux'
import { setFriends } from '../../store/index'

const FriendListWidget = () => {
  const { _id: userId, friends } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const token = useSelector((state) => state.token)

  const isNonMobileScreens = useMediaQuery('(min-width:1000px)')

  const getAllFriends = async () => {
    const response = await fetch(
      `http://localhost:5000/user/${userId}/friends`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    const friends = await response.json()
    console.log(friends)
    dispatch(setFriends({ friends }))
  }

  useEffect(() => {
    getAllFriends()
  }, [])

  return (
    <Box>
      {friends.map((friend) => (
        <Box m="1rem 0" key={friend._id}>
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        </Box>
      ))}
    </Box>
  )
}

export default FriendListWidget
