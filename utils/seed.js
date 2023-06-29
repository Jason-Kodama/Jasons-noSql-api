const connection = require('../config/connection');
const { User, Thoughts, Reaction } = require('../models');

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
    await Thoughts.deleteMany({});
    await User.deleteMany({});
  
    await User.collection.insertMany(users);

    console.info('Seeding complete!');
    process.exit(0);
  });