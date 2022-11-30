import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      location,
      occupation,
    } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    })

    const savedUser = await newUser.save()

    res.status(201).json({
      user: {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        picturePath: savedUser.picturePath,
        friends: savedUser.friends,
        location: savedUser.location,
        occupation: savedUser.occupation,
        viewedProfile: savedUser.viewedProfile,
        impressions: savedUser.impressions,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* LOGGING IN */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' })
    }
    const isMatch = bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    // const userCopy = Object.assign(user)
    // delete userCopy.password
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        picturePath: user.picturePath,
        friends: user.friends,
        location: user.location,
        occupation: user.occupation,
        viewedProfile: user.viewedProfile,
        impressions: user.impressions,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
