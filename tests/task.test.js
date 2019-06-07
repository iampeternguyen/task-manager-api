const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Task = require('../src/models/task');
const { setUpDatabase, userOne, userTwo, taskOne, taskTwo } = require('./setupTests');

const newTask = {
	_id: new mongoose.Types.ObjectId(),
	title: 'new task',
	description: 'this task is new',
	owner: userOne._id,
};

describe('Adding task', () => {
	beforeEach(setUpDatabase);

	it('Should add a task', async () => {
		await request(app)
			.post('/tasks')
			.send(newTask)
			.expect(201);
		const task = await Task.findById(newTask._id);
		expect(task).not.toBeNull();
	});

	it("Should not add a task that doesn't have a title", async () => {
		const id = new mongoose.Types.ObjectId();
		await request(app)
			.post('/tasks')
			.send({
				_id: id,
				description: "This task doesn't have an owner",
			})
			.expect(400);

		const task = await Task.findById(id);
		expect(task).toBeNull();
	});

	it("Should not add a task that doesn't have an owner", async () => {
		const id = new mongoose.Types.ObjectId();
		await request(app)
			.post('/tasks')
			.send({
				_id: id,
				title: 'new task title',
				description: "This task doesn't have a title",
			})
			.expect(400);

		const task = await Task.findById(id);
		expect(task).toBeNull();
	});

	it("Should not add a task that doesn't have a valid owner", async () => {
		const id = new mongoose.Types.ObjectId();
		const owner = new mongoose.Types.ObjectId();
		await request(app)
			.post('/tasks')
			.send({
				_id: id,
				title: 'new task title',
				description: "This task doesn't have a title",
				owner,
			})
			.expect(400);

		const task = await Task.findById(id);
		expect(task).toBeNull();
	});
});

describe('Read tasks', () => {
	beforeEach(setUpDatabase);
	it('Should read task by id', async () => {
		const response = await request(app)
			.get(`/tasks/${taskOne._id}`)
			.send()
			.expect(200);
		expect(response.body).toMatchObject({ title: taskOne.title });
	});

	it('Should return 404 for invalid id', async () => {
		const id = new mongoose.Types.ObjectId();
		await request(app)
			.get(`/tasks/${id}`)
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
			.patch(`/tasks/${taskTwo._id}`)
			.send({ title: 'updated title', description: 'updated description', completed: false })
			.expect(200);

		const task = await Task.findById(taskTwo._id);
		expect(task.title).not.toBe(taskTwo.title);
		expect(task.description).not.toBe(taskTwo.description);
		expect(task.completed).not.toBe(taskTwo.completed);
	});

	it('Should not update task if id field is specified', async () => {
		await request(app)
			.patch(`/tasks/${taskTwo._id}`)
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
			.patch(`/tasks/${id}`)
			.send(newTask)
			.expect(404);
	});
});

describe('Delete task', () => {
	beforeEach(setUpDatabase);
	it('Should delete a task by ID', async () => {
		await request(app)
			.delete(`/tasks/${taskOne._id}`)
			.send()
			.expect(200);
		const task = await Task.findById(taskOne._id);
		expect(task).toBeNull();
	});

	it('Should return 404 for invalid id', async () => {
		const id = new mongoose.Types.ObjectId();
		await request(app)
			.delete(`/tasks/${id}`)
			.send()
			.expect(404);
	});
});
