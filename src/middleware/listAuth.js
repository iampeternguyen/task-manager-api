const List = require('../models/list');

const listAuth = async (req, res, next) => {
	try {
		const list = await List.findById(req.params.list);

		let isAuthorized = list.project.toString() === req.project._id.toString();
		if (!isAuthorized) {
			throw new Error();
		}
		req.list = list;
		next();
	} catch (error) {
		res.status(400).send();
	}
};

module.exports = listAuth;
