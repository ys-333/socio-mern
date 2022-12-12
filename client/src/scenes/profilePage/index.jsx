import { useLocation, useParams } from 'react-router-dom'

const ProfilePage = () => {
  const params = useParams()
  const location = useLocation()

  console.log(location)
  console.log(params.friends)

  return <h1>Profile Page</h1>
}
export default ProfilePage
