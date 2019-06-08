const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

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

router.get('/users/me', auth, async (req, res) => {
	res.send({ user: req.user });
});

router.patch('/users/:id', auth, async (req, res) => {
	const allowedUpdates = ['name', 'email', 'password'];
	const updates = Object.keys(req.body);
	const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

	if (!isValidUpdate) {
		return res.status(400).send({ error: 'Invalid update request' });
	}

	try {
		updates.forEach(update => (req.user[update] = req.body[update]));
		await req.user.save();
		res.send({ user: req.user });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.delete('/users/me', auth, async (req, res) => {
	try {
		const user = await req.user.remove();
		res.send({ user });
	} catch (error) {
		res.status(400).send();
	}
});

module.exports = router;
