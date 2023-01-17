import {
  ChatBubbleOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  MoreHorizOutlined,
  CloseOutlined,
} from '@mui/icons-material'
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Modal,
  Button,
} from '@mui/material'
import FlexBetween from '../../components/FlexBetween'
import Friend from '../../components/Friend'
import WidgetWrapper from '../../components/WidgetWrapper'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPost } from '../../store/index'

const ModalOverlay = (props) => {
  const handleClose = () => {
    props.onClose()
  }

  const deleteHandler = () => {
    // todo some logic to delete the post
  }

  return (
    <Modal open={props.open} onClose={handleClose}>
      <FlexBetween
        style={{
          width: '25%',
          margin: '18rem auto',
          background: 'rgb(0,0,0)',
          padding: '2rem',
          borderRadius: '0.75',
        }}
      >
        <IconButton onClick={handleClose}>
          <FlexBetween>
            <Typography>Cancel</Typography>
            <CloseOutlined />
          </FlexBetween>
        </IconButton>
        <Button variant="outlined" color="error" onClick={deleteHandler}>
          Delete
        </Button>
      </FlexBetween>
    </Modal>
  )
}

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [open, setOpen] = useState(false)
  const [isComment, setIsComments] = useState(false)
  const dispatch = useDispatch()
  const token = useSelector((state) => state.token)
  const loggedInUserId = useSelector((state) => state.user._id)
  const isLiked = Boolean(likes[loggedInUserId])
  const likeCounts = Object.keys(likes).length

  const { palette } = useTheme()
  const main = palette.neutral.main
  const primary = palette.primary.main

  const openHandler = () => {
    setOpen((prev) => !prev)
  }

  const patchLike = async () => {
    const response = await fetch(`http://localhost:5000/posts/${postId}/like`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        AccessControlAllowPrivateNetwork: true,
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    })
    const updatedPost = await response.json()
    dispatch(setPost({ post: updatedPost }))
  }

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: '1rem' }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
          src={`http://localhost:5000/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCounts}</Typography>
          </FlexBetween>
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComment)}>
              <ChatBubbleOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        <FlexBetween>
          <IconButton>
            <ShareOutlined />
          </IconButton>
          <IconButton sx={{ ml: '.8rem' }} onClick={openHandler}>
            <MoreHorizOutlined />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
      {isComment && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: '0.5rem 0', pl: '1rem' }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
      <ModalOverlay open={open} onClose={openHandler} />
    </WidgetWrapper>
  )
}
export default PostWidget
