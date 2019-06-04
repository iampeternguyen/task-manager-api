const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Task = require('../src/models/task');

const taskOne = {
	_id: new mongoose.Types.ObjectId(),
	title: 'task one',
};

const taskTwo = {
	_id: new mongoose.Types.ObjectId(),
	title: 'task two',
	description: 'this task is set to complete',
	completed: true,
};

const setUpDatabase = async () => {
	await Task.deleteMany();
	await new Task(taskOne).save();
	await new Task(taskTwo).save();
};

describe('Adding task', () => {
	beforeEach(setUpDatabase);

	it('Should add a task', async () => {
		const newTask = {
			_id: new mongoose.Types.ObjectId(),
			title: 'new task',
			description: 'this task is new',
		};
		await request(app)
			.post('/task')
			.send(newTask)
			.expect(201);
		const task = await Task.findById(newTask._id);
		expect(task).not.toBeNull();
	});

	it("Should not add a task that doesn't have a title", async () => {
		const id = new mongoose.Types.ObjectId();
		await request(app)
			.post('/task')
			.send({
				_id: id,
				description: "This task doesn't have a title",
			})
			.send()
			.expect(400);

		const task = await Task.findById(id);
		expect(task).toBeNull();
	});
});
