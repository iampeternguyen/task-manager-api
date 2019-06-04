const express = require('express');
require('./db/mongoose');
const app = express();

app.use(express.json());

const userRouter = require('./routers/user');
app.use(userRouter);

const taskRouter = require('./routers/task');
app.use(taskRouter);

app.get('/', (req, res) => {
	res.send(
		'This is the backend API for a task manager app. To see the full source code go to https://github.com/iampeternguyen/task-manager-api'
	);
});

module.exports = app;
