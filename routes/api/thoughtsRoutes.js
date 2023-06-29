const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtsById,
    createThoughts,
    updateThoughts,
    deleteThoughts,
    addReaction,
    removeReaction,
} = require('../../controllers/thoughtsController');

// /api/thoughts
router.route('/').get(getAllThoughts).post(createThoughts);

// /api/thoughts/:thoughtId
router.route('/:id').get(getThoughtsById).put(updateThoughts).delete(deleteThoughts);

// api/thoughts/:thoughtId/reactions
router.route('/:thoughtsId/reactions').post(addReaction);
router.route('/thoughtsId/reactions/:reactionId').delete(removeReaction);

module.exports = router;