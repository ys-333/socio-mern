import User from '../models/User'

/*READ*/

export const getUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    res.status(200).json(user)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id)),
    )
    const formattedFriends = friends.map(
      ({ _id, fistName, lastName, occupation, location, picturePath }) => {
        return { _id, fistName, lastName, occupation, location, picturePath }
      },
    )
    res.status(200).json(formattedFriends)
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
}

/*UPDATE*/

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params
    const user = await User.findById(id)
    const friend = await User.findById(friendId)
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId)
      friend.friends = friend.friends.filter((id) => id !== id)
    } else {
      user.friends.push(friendId)
      friend.friends.push(id)
    }
    await user.save()
    await friend.save()

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id)),
    )
    const formattedFriends = friends.map(
      ({ _id, fistName, lastName, occupation, location, picturePath }) => {
        return { _id, fistName, lastName, occupation, location, picturePath }
      },
    )
    res.status(200).json(formattedFriends)
  } catch (err) {
    res.status(404).json({ err: err.message })
  }
}

/*ADD SOCIAL HANDLE*/

export const addSocialHandle = async (req, res) => {
  try {
    const { userId } = req.params
    const { link } = req.body

    if (link.length === 0) {
      return res.status(400).json({ message: 'Please add socail handle' })
    }
    const social = req.header('social') //to know which social media it is

    const user = await User.findById(userId)

    console.log(user, req.body, social)

    if (!user) {
      return res.status(400).json({ status: 400, message: 'User do not exist' })
    }
    if (social === 'twitter') {
      user.twitter = link
    } else {
      user.linkedin = link
    }
    await user.save()
    return res.status(200).json({
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
        twitter: user.twitter,
        linkedin: user.linkedin,
      },
    })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}
