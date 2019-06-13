const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const List = require('../models/list');
const Project = require('../models/project');

router.post(`/lists`, auth, async (req, res) => {
	try {
		const list = new List(req.body);
		if (!(await list.userIsProjectOwner(req.user._id))) {
			throw new Error();
		}
		await list.save();
		res.status(201).send(list);
	} catch (error) {
		res.status(400).send();
	}
});

router.get(`/lists`, auth, async (req, res) => {
	try {
		const lists = await List.find({ project: req.query.project });
		if (!lists[0].userIsProjectOwner(req.user._id)) {
			throw new Error();
		}
		res.send({ lists });
	} catch (error) {
		res.status(400).send();
	}
});

router.get(`/lists/:list`, auth, async (req, res) => {
	const list = await List.findById(req.params.list);

	try {
		if (!(await list.userIsProjectOwner(req.user._id))) {
			throw new Error();
		}
		res.send({ list });
	} catch (error) {
		res.status(400).send();
	}
});

router.patch(`/lists/:list`, auth, async (req, res) => {
	try {
		const list = await List.findById(req.params.list);
		if (!(await list.userIsProjectOwner(req.user._id))) {
			throw new Error();
		}

		const updateable = ['name', 'project'];
		const updates = Object.keys(req.body);
		const isValidUpdate = updates.every(update => updateable.includes(update));
		if (!isValidUpdate) {
			throw new Error();
		}

		if (req.body.project) {
			const project = await Project.findById(req.body.project);
			if (!project.userIsProjectOwner(req.user._id)) {
				throw new Error();
			}
		}

		updates.forEach(update => {
			list[update] = req.body[update];
		});

		await list.save();
		res.send({ list });
	} catch (error) {
		res.status(400).send();
	}
});

router.delete(`/lists/:list`, auth, async (req, res) => {
	try {
		const list = await List.findById(req.params.list);
		if (!(await list.userIsProjectOwner(req.user._id))) {
			throw new Error();
		}
		await list.remove();
		res.send({ list });
	} catch (error) {
		res.status(400).send();
	}
});
module.exports = router;
