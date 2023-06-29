const { User, Thoughts } = require('../models');

const userController = {
    getAllUser(req, res) {
        User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err));
    },

    getUserById(req, res) {
        User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate('friends')
      .populate('thoughts')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

    createUser(req, res) {
        User.create({
            username: req.body.username,
            email: req.body.email
        })
          .then((dbUserData) => res.json(dbUserData))
          .catch((err) => res.status(500).json(err));
      },

    updateUser(req, res) {
            User.findOneAndUpdate(
                { _id: req.params.userId }, 
                {
                  username: req.body.username,
                  email: req.body.email
                }, 
                { new: true }, 
                (err, result) => {
                  if (result) {
                    res.status(200).json(result);
                    console.log(`Updated: ${result}`);
                  } else {
                    console.log(err);
                    res.status(500).json({ message: 'error', err });
                  }
                }
            )
        },

    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : Thoughts.deleteMany( { username: user.username})
                  .then((thoughts) => 
                    !thoughts
                    ? res.status(404).json({ message: 'No thoughts for that user' })
                    : res.json(user)
                  )
                )
            .catch((err) => res.status(500).json(err));
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId }},
            { new: true, runValidators: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No user with id' });
            return
    }
        res.json(dbUserData)
        })
        .catch((err) => res.json(err));
    },

    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user with id' })
            }
            res.json(dbUserData)
        })
        .catch ((err) => res.json(err));
    }
}

module.exports = userController;