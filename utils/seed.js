const connection = require('../config/connection');
const { User, Thought, Reaction } = require('../models');

const users = [
    {
        username: 'Bob',
        email: 'bobsburgers@gmail.com'
    },
    {
        username: 'Linda',
        email: 'lindaburger@gmail.com'
    },
    {
        username: 'Gene',
        email: 'geneburger@gmail.com'
    },
    {
        username: 'Louise',
        email: 'louiseburger@gmail.com'
    },
    {
        username: 'Teddy',
        email: 'teddyburger@gmail.com'
    }
]

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');
    await Thought.deleteMany({});
    await User.deleteMany({});

    await User.collection.insertMany(users);

    console.info('Successfully seeded');
    process.exit(0);
});