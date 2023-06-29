const { User, Thought } = require('../models');

module.exports = {
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate('friends')
      .populate('thoughts')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that id' })
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
                ? res.status(404).json({ message: 'No user with that id' })
                : Thought.deleteMany( { username: user.username})
                  .then((thoughts) => 
                    !thoughts
                    ? res.status(404).json({ message: 'No thoughts for that user' })
                    : res.json(user)
                  )
                )
            .catch((err) => res.status(500).json(err));
    },

    addFriend(req, res) {
        User.findOne({ _id: req.params.friendId })
          .select('-__v')
          .then((user) => {
              return User.findOneAndUpdate (
                { _id: req.params.userId}, 
                {$addToSet: {
                    friends: user._id
                }},
                { new: true} 
              );
          }).then((user) => 
            !user
              ? res.status(404).json({ message: 'No user with that id' })
              : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
    },

    deleteFriend(req, res) {
        User.findOne({ _id: req.params.friendId })
          .select('-__v')
          .then((user) => {
              return User.findOneAndUpdate (
                { _id: req.params.userId}, 
                {$pull: {
                    friends: user._id
                }},
                { new: true} 
              );
          }).then((user) => 
            !user
              ? res.status(404).json({ message: 'No user with that id' })
              : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
    }
};