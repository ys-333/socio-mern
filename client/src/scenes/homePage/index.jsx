import { Box } from '@mui/material'
import Navbar from '../navbar/index'
import { useSelector } from 'react-redux'

const HomePage = () => {
  const user = useSelector((state) => state.user)
  const token = useSelector((state) => state.token)
  if (user) {
    console.log(user)
    console.log(token)
  }
  return (
    <Box>
      <Navbar />
    </Box>
  )
}
export default HomePage
