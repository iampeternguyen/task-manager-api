const Project = require('../models/project');

const projectAuth = async (req, res, next) => {
	try {
		const project = await Project.findById(req.params.project);
		let isAuthorized = project.owner.toString() === req.user._id.toString();
		// check if teammember
		if (!isAuthorized) {
			throw new Error();
		}
		req.project = project;
		next();
	} catch (error) {
		res.status(400).send();
	}
};

module.exports = projectAuth;
