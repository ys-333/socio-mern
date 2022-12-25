import { SaveAsOutlined } from '@mui/icons-material'
import { Button, IconButton, TextField } from '@mui/material'
import { Formik } from 'formik'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const SocialProfileForm = ({ handler, label, placeholder, socialLink }) => {
  const [error, setError] = useState({
    isError: false,
    message: '',
  })
  const { _id } = useSelector((state) => state.user)
  const token = useSelector((state) => state.token)

  //  validating request

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (values.link.trim().length === 0) {
      setError({
        isError: true,
        message: 'Please add social handle..',
      })
      return
    } else {
      setError({
        isError: false,
        message: '',
      })
    }
    console.log(JSON.stringify(values))
    const response = await fetch(`http://localhost:5000/user/social/${_id}`, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
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
          {error.isError && <p style={{ color: 'red' }}>{error.message}</p>}

          <Button type="submit" sx={{ ml: '7em' }}>
            <SaveAsOutlined />
          </Button>
        </form>
      )}
    </Formik>
  )
}

export default SocialProfileForm
