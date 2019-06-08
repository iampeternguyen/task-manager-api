const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/users', async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		res.status(201).send({ user });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (error) {
		res.status(400).send();
	}
});

router.get('/users/:id', async (req, res) => {
	const id = req.params.id;
	const user = await User.findById(id);

	if (!user) {
		return res.status(404).send();
	}
	res.send({ user });
});

router.patch('/users/:id', async (req, res) => {
	const id = req.params.id;
	const allowedUpdates = ['name', 'email', 'password'];
	const updates = Object.keys(req.body);
	const user = await User.findById(id);

	if (!user) {
		return res.status(404).send();
	}

	const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

	if (!isValidUpdate) {
		return res.status(400).send({ error: 'Invalid update request' });
	}

	try {
		updates.forEach(update => (user[update] = req.body[update]));
		await user.save();
		res.send({ user });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.delete('/users/:id', async (req, res) => {
	const id = req.params.id;
	try {
		const user = await User.findByIdAndDelete(id);
		if (!user) {
			return res.status(404).send();
		}
		res.send({ user });
	} catch (error) {
		res.status(400).send();
	}
});

module.exports = router;
