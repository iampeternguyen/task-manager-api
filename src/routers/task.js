const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.post('/tasks/', async (req, res) => {
	const task = new Task(req.body);
	try {
		await task.save();
		res.status(201).send({ task });
	} catch (error) {
		res.status(400).send();
	}
});

router.get('/tasks', async (req, res) => {
	try {
		const tasks = await Task.find({ owner: req.body.user._id });
		if (!tasks) {
			res.status(404).send;
		}
		res.send({ tasks });
	} catch (error) {
		res.status(404).send();
	}
});

router.get('/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) {
			return res.status(404).send();
		}
		res.send({ task });
	} catch (error) {
		res.status(500).send();
	}
});

router.patch('/tasks/:id', async (req, res) => {
	const allowedUpdates = ['title', 'description', 'completed'];
	const updates = Object.keys(req.body);
	const isValidUpdate = updates.every(update => allowedUpdates.includes(update));
	const task = await Task.findById(req.params.id);

	if (!task) {
		return res.status(404).send();
	} else if (!isValidUpdate) {
		return res.status(400).send();
	}
	try {
		updates.forEach(update => (task[update] = req.body[update]));

		await task.save();
		res.send({ task });
	} catch (error) {
		res.status(500).send();
	}
});

router.delete('/tasks/:id', async (req, res) => {
	const id = req.params.id;
	try {
		const task = await Task.findByIdAndDelete(id);
		if (!task) {
			return res.status(404).send();
		}
		res.send({ task });
	} catch (error) {
		res.status(400).send();
	}
});

module.exports = router;
