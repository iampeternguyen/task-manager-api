const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.post('/task', async (req, res) => {
	const task = new Task(req.body);
	try {
		await task.save();
		res.status(201).send(task);
	} catch (error) {
		res.status(400).send();
	}
});

module.exports = router;
