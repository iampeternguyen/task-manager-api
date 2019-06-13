const Task = require('../src/models/task');
const User = require('../src/models/user');
const { setUpDatabase, userOne, userTwo, taskOne, taskTwo } = require('./setupTests');

describe('User/Task relationship', () => {
	beforeEach(setUpDatabase);

	it('Should get all tasks from a user model', async () => {
		const user = await User.findById(userOne._id);
		await user.populate('tasks').execPopulate();
		expect(user.tasks.length).toBe(2);
	});
});
