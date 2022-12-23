import { Box, useMediaQuery } from '@mui/material'
import Navbar from '../navbar/index'
import { useSelector } from 'react-redux'
import UserWidget from '../widgets/UserWidget'

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)')
  const user = useSelector((state) => state.user)
  const { _id, picturePath } = user

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap=".5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? '42%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}
        ></Box>
        {isNonMobileScreens && <Box flexBasis="26%"></Box>}
      </Box>
    </Box>
  )
}
export default HomePage
