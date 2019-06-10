const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const projectAuth = require('../middleware/projectAuth');
const listAuth = require('../middleware/listAuth');
const List = require('../models/list');
const Project = require('../models/project');

router.post(`/projects/:project/lists`, auth, projectAuth, async (req, res) => {
	try {
		const list = new List(req.body);
		list.project = req.project._id;
		await list.save();
		res.status(201).send(list);
	} catch (error) {
		res.status(400).send();
	}
});

router.get(`/projects/:project/lists`, auth, projectAuth, async (req, res) => {
	try {
		const lists = await List.find({ project: req.project._id });
		res.send({ lists });
	} catch (error) {
		res.status(400).send();
	}
});

router.get(`/projects/:project/lists/:list`, auth, projectAuth, listAuth, async (req, res) => {
	try {
		res.send({ list: req.list });
	} catch (error) {
		res.status(400).send();
	}
});

router.patch(`/projects/:project/lists/:list`, auth, projectAuth, listAuth, async (req, res) => {
	try {
		const updateable = ['name', 'project'];
		const updates = Object.keys(req.body);
		const isValidUpdate = updates.every(update => updateable.includes(update));
		if (!isValidUpdate) {
			throw new Error();
		}

		updates.forEach(async update => {
			if (update === 'project') {
				const project = await Project.findById(req.body[update]);
				if (!project.owner.toString() === req.user._id) {
					throw new Error();
				}
			}
			req.list[update] = req.body[update];
		});

		await req.list.save();

		res.send({ list: req.list });
	} catch (error) {
		res.status(400).send();
	}
});

router.delete(`/projects/:project/lists/:list`, auth, projectAuth, listAuth, async (req, res) => {
	try {
		const list = await req.list.remove();
		res.send({ list });
	} catch (error) {
		res.status(400).send();
	}
});
module.exports = router;
