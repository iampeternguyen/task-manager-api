const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.post('/user', async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		res.status(201).send(user);
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get('/user/:id', async (req, res) => {
	const id = req.params.id;
	const user = await User.findById(id);
	res.send(user);
});

router.patch('/user/:id', async (req, res) => {
	const id = req.params.id;
	const allowedUpdates = ['name', 'email', 'password'];
	const updates = Object.keys(req.body);
	const user = await User.findById(id);

	const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

	if (!isValidUpdate) {
		return res.status(400).send({ error: 'Invalid update request' });
	}

	try {
		updates.forEach(update => (user[update] = req.body[update]));
		await user.save();
		res.send(user);
	} catch (error) {
		res.status(400).send(error);
	}
});

module.exports = router;
