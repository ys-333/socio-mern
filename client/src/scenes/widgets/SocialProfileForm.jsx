import { SaveAsOutlined } from '@mui/icons-material'
import { Button, IconButton, TextField } from '@mui/material'
import { Formik } from 'formik'
import { useSelector } from 'react-redux'

const SocialProfileForm = ({
  userId,
  handler,
  label,
  placeholder,
  setState,
}) => {
  const { _id } = useSelector((state) => state.user)
  const token = useSelector((state) => state.token)

  console.log(_id, token)

  const handleFormSubmit = async (values, onSubmitProps) => {
    const response = await fetch(`http://localhost:5000/user/social/${_id}`, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        Authorization: `Bearer ${token}`,
        social: label,
      },
    })

    const savedUser = await response.json()
    console.log(savedUser)

    handler()
    onSubmitProps.resetForm()
  }

  return (
    <Formik initialValues={{ link: '' }} onSubmit={handleFormSubmit}>
      {({ values, handleChange, handleBlur, handleSubmit, resetForm }) => (
        <form onSubmit={handleSubmit}>
          <TextField
            label={label}
            name="link"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.link}
            placeholder={placeholder}
          />

          <Button type="submit" sx={{ ml: '7em' }}>
            <SaveAsOutlined />
          </Button>
        </form>
      )}
    </Formik>
  )
}

export default SocialProfileForm
