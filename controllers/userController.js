const { User, Thoughts } = require('../models');

const userController = {
    getAllUser(req, res) {
        User.find({})
        .populate({
            path: 'friends',
            select: '-__v',
        })
        .select('-__v')
        .sort({_id: -1 })
        .then((dbUserData) => res.json(dbUserData))
        .catch ((err) => {
            res.sendStatus(err);
        });
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v',
        })
        .populate({
            path: 'friends',
            select: '-__v',
        })
        .select('-__v')
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found with id'});
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            res.sendStatus(err);
        })
    },

    createUser({ body}, res) {
        User.create(body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.json(err));
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true,
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err))
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user with id'});
            }
            return Thoughts.deleteMany({ _id: {$in: dbUserData.thoughts } })
        })
        .then(() => {
            res.json({ message: 'User and thoughts deleted'});
        })
        .catch ((err) => res.json(err));
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