const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

router.post('/tasks/', auth, async (req, res) => {
	try {
		const task = new Task(req.body);
		task.owner = req.user._id;
		await task.save();
		res.status(201).send({ task });
	} catch (error) {
		res.status(400).send();
	}
});

router.get('/tasks', auth, async (req, res) => {
	try {
		const tasks = await Task.find({ owner: req.user._id });
		if (!tasks) {
			res.status(404).send;
		}
		res.send({ tasks });
	} catch (error) {
		res.status(404).send();
	}
});

router.get('/tasks/:task', auth, async (req, res) => {
	try {
		const task = await Task.findOne({ _id: req.params.task, owner: req.user._id });
		if (!task) {
			return res.status(404).send();
		}
		res.send({ task });
	} catch (error) {
		res.status(500).send();
	}
});

router.patch('/tasks/:task', auth, async (req, res) => {
	const allowedUpdates = ['title', 'description', 'completed'];
	const updates = Object.keys(req.body);
	const isValidUpdate = updates.every(update => allowedUpdates.includes(update));
	const task = await Task.findOne({ _id: req.params.task, owner: req.user._id });

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

router.delete('/tasks/:task', auth, async (req, res) => {
	try {
		const task = await Task.findOneAndDelete({ _id: req.params.task, owner: req.user._id });
		if (!task) {
			return res.status(404).send();
		}
		res.send({ task });
	} catch (error) {
		res.status(400).send();
	}
});

module.exports = router;
