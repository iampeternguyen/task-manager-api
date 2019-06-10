const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const List = require('../src/models/list');
const Task = require('../src/models/task');
const Project = require('../src/models/project');
const {
	setUpDatabase,
	userOne,
	userTwo,
	taskOne,
	taskTwo,
	listOne,
	listTwo,
	projectOne,
	projectTwo,
	authorizedUserOneToken,
	authorizedUserTwoToken,
} = require('./setupTests');

describe('Adding Lists', () => {
	beforeAll(setUpDatabase);
	test('Should allow authenticated user to add list to project', async () => {
		const authToken = await authorizedUserOneToken();
		const newList = { _id: new mongoose.Types.ObjectId(), name: 'new list category' };
		await request(app)
			.post(`/projects/${projectOne._id}/lists`)
			.set('Authorization', authToken)
			.send(newList)
			.expect(201);
		const list = await List.findById(newList._id);
		expect(list).not.toBeNull();
	});

	test('Should not add list if invalid project id ', async () => {
		const authToken = await authorizedUserOneToken();
		const id = new mongoose.Types.ObjectId();
		const newList = { _id: new mongoose.Types.ObjectId(), name: 'new list category' };
		await request(app)
			.post(`/projects/${id}/lists`)
			.set('Authorization', authToken)
			.send(newList)
			.expect(400);
		const list = await List.findById(newList._id);
		expect(list).toBeNull();
	});
});

describe('Reading Lists', () => {
	beforeAll(setUpDatabase);
	test('Should get individual list', async () => {
		const authToken = await authorizedUserOneToken();
		const response = await request(app)
			.get(`/projects/${projectOne._id}/lists/${listOne._id}`)
			.set('Authorization', authToken)
			.send()
			.expect(200);
		expect(response.body.list.name).toBe(listOne.name);
	});

	test('Should get all lists ', async () => {
		const authToken = await authorizedUserOneToken();
		const response = await request(app)
			.get(`/projects/${projectOne._id}/lists`)
			.set('Authorization', authToken)
			.send()
			.expect(200);
		expect(response.body.lists.length).toBe(1);
	});
});

describe('Updating List', () => {
	beforeAll(setUpDatabase);
	test('Should update list name', async () => {
		const authToken = await authorizedUserOneToken();
		const response = await request(app)
			.patch(`/projects/${projectOne._id}/lists/${listOne._id}`)
			.set('Authorization', authToken)
			.send({ name: 'new list name' })
			.expect(200);
		expect(response.body.list.name).not.toBe(listOne.name);
	});

	test('Should be able to update the list project ', async () => {
		const authToken = await authorizedUserOneToken();
		const newProject = { _id: new mongoose.Types.ObjectId(), name: 'new project', owner: userOne._id };
		await request(app)
			.post('/projects')
			.set('Authorization', authToken)
			.send(newProject)
			.expect(201);

		const response = await request(app)
			.patch(`/projects/${projectOne._id}/lists/${listOne._id}`)
			.set('Authorization', authToken)
			.send({ name: 'new list name' })
			.expect(200);
		expect(response.body.list.project).not.toBe(listOne.project);
	});

	test("Should not be able to update the list project if project doesn't belong to user", async () => {
		const authToken = await authorizedUserOneToken();
		const response = await request(app)
			.patch(`/projects/${projectOne._id}/lists/${listOne._id}`)
			.set('Authorization', authToken)
			.send({ name: 'new list name', project: projectTwo._id })
			.expect(200);
		expect(response.body.list.project).toBe(listOne.project.toString());
	});
});

describe('Delete list', () => {
	beforeAll(setUpDatabase);
	test('Should delete list', async () => {
		const authToken = await authorizedUserOneToken();
		await request(app)
			.delete(`/projects/${projectOne._id}/lists/${listOne._id}`)
			.set('Authorization', authToken)
			.send()
			.expect(200);
		const list = await List.findById(listOne._id);
		expect(list).toBeNull();
	});
});
