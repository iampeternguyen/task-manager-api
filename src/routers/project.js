const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const projectAuth = require('../middleware/projectAuth');
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

router.get('/projects', auth, async (req, res) => {
	try {
		const projects = await Project.find({ owner: req.user._id });
		res.send({ projects });
	} catch (error) {
		res.status(400).send();
	}
});

router.get('/projects/:project', auth, projectAuth, (req, res) => {
	try {
		res.send({ project: req.project });
	} catch (error) {
		res.status(400).send();
	}
});

router.patch('/projects/:project', auth, projectAuth, async (req, res) => {
	try {
		const updatable = ['name'];
		const updates = Object.keys(req.body);
		const isValidUpdate = updates.every(update => updatable.includes(update));
		if (!isValidUpdate) {
			throw new Error();
		}
		updates.forEach(update => (req.project[update] = req.body[update]));
		await req.project.save();
		res.send({ project: req.project });
	} catch (error) {
		res.status(400).send();
	}
});

router.delete('/projects/:project', auth, projectAuth, async (req, res) => {
	try {
		const project = await req.project.remove();
		res.send({ project });
	} catch (error) {
		res.status(400).send();
	}
});
module.exports = router;
