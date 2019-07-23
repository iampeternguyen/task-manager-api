#Task Manager API

This is a backend API based in nodejs and mongo for a task manager application.

For testing start mongo
npm run mongo

Then start the api server
npm run dev

Authentication is by bearer token.

###Users

**/users**
To add user, send post request with
{name, email, password}

**/users/login**
To login, send post request with {email, password}, will return {user, token}

**/users/me**
Can read user profile, update, and delete user\*

###Adding Projects, Lists, Tasks

**/projects**
Add a project by sending {name}

**/lists**
Add new list by sending {name, project: projectId}

**/tasks**
Add task by sending post request with {title, description, list: listId}

###Reading/Updating/Deleting
**/projects/ID**
**/lists/ID**

Get all lists of a project
**/lists?project=ID**
