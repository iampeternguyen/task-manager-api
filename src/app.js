const express = require('express');
require('./db/mongoose');
const app = express();

const userRouter = require('./routers/user');

app.use(express.json());
app.use(userRouter);

app.get('/', (req, res) => {
	res.send(
		'This is the backend API for a task manager app. To see the full source code go to https://github.com/iampeternguyen/task-manager-api'
	);
});

module.exports = app;
