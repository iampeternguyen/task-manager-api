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

module.exports = router;
