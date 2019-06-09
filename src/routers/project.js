const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/project');

router.post('/projects', auth, async (req, res) => {
	try {
		const project = new Project(req.body);
		project.owner = req.user._id;
		await project.save();
		res.status(201).send(project);
	} catch (error) {
		res.status(400).send();
	}
});

module.exports = router;
