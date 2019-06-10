const express = require('express');
require('./db/mongoose');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const userRouter = require('./routers/user');
app.use(userRouter);

const taskRouter = require('./routers/task');
app.use(taskRouter);

const projectRouter = require('./routers/project');
app.use(projectRouter);

const listRouter = require('./routers/list');
app.use(listRouter);

app.get('/', (req, res) => {
	res.send(
		'This is the backend API for a task manager app. To see the full source code go to https://github.com/iampeternguyen/task-manager-api'
	);
});

module.exports = app;
