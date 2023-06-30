# Jasons-noSql-api

## Description
Using noSQL, this is a social network API that allows a user to create and share a thought and react to another friends thought.

## Usage
To use this application, you must first clone the repository. Then you are going to run an npm install, followed by 'npm run seed' and 'npm start'. You are also going to need insomnia to run this application. Open insomnia and have 'localhost:3001/api/' in the address bar. The address bar links will be listed below.

USER
Get all users/create a user: /api/users
Get single user/update/delete user: /api/users/:userId
Add/delete user: /api/users/:userId/friends/:friendId

Thoughts/Reactions
Get all thoughts/create a thought: /api/thoughts
Get single thought/update/delete: /api/thoughts/:thoughId
Create reaction: /api/thoughts/:thoughtid/reactions
Delete reaction: /api/thoughts/:thoughtId/reactions/:reactionId

## Video Link
https://drive.google.com/file/d/1FJK7t4heKG4PqMkXfpsYqMv6__joQlzJ/view