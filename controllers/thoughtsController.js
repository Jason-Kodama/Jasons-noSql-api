const { Thoughts, User } = require('../models');

const thoughtsController = {
    getAllThoughts(req, res) {
        Thoughts.find()
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
    },

    getThoughtsById({ params }, res) {
        Thoughts.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .populate('reactions')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

    createThoughts({ params, body }, res) {
        Thoughts.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id } },
                { new: true }
            )
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'Thought created but no user with this id'});
            }
            res.json({ message: 'Thought created' })
        })
        .catch((err) => res.json(err))
    },

    updateThoughts({ params, body }, res) {
        Thoughts.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true,
        })
        .then((dbThoughtsData) => {
            if (!dbThoughtsData) {
                res.status(404).json({ message: 'No thoughts found with this id' })
                return;
            }
            res.json(dbThoughtsData)
        })
        .catch((err) => res.json(err))
    },

    deleteThoughts({ params }, res) {
        Thoughts.findOneAndDelete({ _id: params.id })
        .then((dbThoughtsData) => {
            if (!dbThoughtsData) {
                return res.status(404).json({ message: 'No thoughts with this id' })
            }
            return User.findOneAndUpdate(
                { thoughts: params.id },
                { $pull: { thoughts: params.id } },
                { new: true }
            )
        })
        .then((dbUserData) => {
            if(!dbUserData) {
                return res.status(404).json({ message: 'Thought created but no user with this id' })
            }
            res.json({ message: 'Thought deleted' })
        })
        .catch((err) => res.json(err))
    },

    addReaction({ params, body }, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtsId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then((dbThoughtsData) => {
            if(!dbThoughtsData) {
                res.status(404).json({ message: 'No thought with this id' })
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch((err) => res.json(err))
    },

    removeReaction({ params }, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtsId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then((dbThoughtsData) => res.json(dbThoughtsData))
        .catch((err) => res.json(err))
    }
};

module.exports = thoughtsController;