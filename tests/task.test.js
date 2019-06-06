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

const newTask = {
	_id: new mongoose.Types.ObjectId(),
	title: 'new task',
	description: 'this task is new',
};

const setUpDatabase = async () => {
	await Task.deleteMany();
	await new Task(taskOne).save();
	await new Task(taskTwo).save();
};

describe('Adding task', () => {
	beforeEach(setUpDatabase);

	it('Should add a task', async () => {
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

describe('Read tasks', () => {
	beforeEach(setUpDatabase);
	it('Should read task by id', async () => {
		const response = await request(app)
			.get(`/task/${taskOne._id}`)
			.send()
			.expect(200);
		expect(response.body).toMatchObject({ title: taskOne.title });
	});

	it('Should return 404 for invalid id', async () => {
		const id = new mongoose.Types.ObjectId();
		await request(app)
			.get(`/task/${id}`)
			.send()
			.expect(404);
	});
	it('Should return all tasks', async () => {
		const response = await request(app)
			.get(`/tasks/all`)
			.send()
			.expect(200);
		expect(response.body.length).toBe(2);
	});
});

describe('Updating Tasks', () => {
	beforeEach(setUpDatabase);

	it('Should update title, description, completed', async () => {
		await request(app)
			.patch(`/task/${taskTwo._id}`)
			.send({ title: 'updated title', description: 'updated description', completed: false })
			.expect(200);

		const task = await Task.findById(taskTwo._id);
		expect(task.title).not.toBe(taskTwo.title);
		expect(task.description).not.toBe(taskTwo.description);
		expect(task.completed).not.toBe(taskTwo.completed);
	});

	it('Should not update task if id field is specified', async () => {
		await request(app)
			.patch(`/task/${taskTwo._id}`)
			.send({
				_id: new mongoose.Types.ObjectId(),
				title: 'updated title',
				description: 'updated description',
				completed: false,
			})
			.expect(400);
	});

	it('Should return 404 for invalid id', async () => {
		const id = new mongoose.Types.ObjectId();
		await request(app)
			.patch(`/task/${id}`)
			.send(newTask)
			.expect(404);
	});
});

describe('Delete task', () => {
	beforeEach(setUpDatabase);
	it('Should delete a task by ID', async () => {
		await request(app)
			.delete(`/task/${taskOne._id}`)
			.send()
			.expect(200);
		const task = await Task.findById(taskOne._id);
		expect(task).toBeNull();
	});

	it('Should return 404 for invalid id', async () => {
		const id = new mongoose.Types.ObjectId();
		await request(app)
			.delete(`/task/${id}`)
			.send()
			.expect(404);
	});
});
