const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
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

describe('Creating Projects', () => {
	beforeAll(setUpDatabase);

	test('Should create a project for User One', async () => {
		const newProj = {
			_id: new mongoose.Types.ObjectId(),
			name: 'new project for user one',
		};
		const authToken = await authorizedUserOneToken();
		await request(app)
			.post('/projects')
			.set('Authorization', authToken)
			.send(newProj)
			.expect(201);

		const project = await Project.findById(newProj._id);
		expect(project).not.toBeNull();
	});

	test('Should not create a project with blank name', async () => {
		const newProj = {
			_id: new mongoose.Types.ObjectId(),
			name: '  ',
		};
		const authToken = await authorizedUserOneToken();
		await request(app)
			.post('/projects')
			.set('Authorization', authToken)
			.send(newProj)
			.expect(400);

		const project = await Project.findById(newProj._id);
		expect(project).toBeNull();
	});
});

describe('Reading Projects', () => {
	beforeAll(setUpDatabase);

	test('Should read project by ID', async () => {
		const authToken = await authorizedUserOneToken();
		const response = await request(app)
			.get(`/projects/${projectOne._id}`)
			.set('Authorization', authToken)
			.expect(200);
		expect(response.body.project.name).toBe(projectOne.name);
	});

	test('Should not read project by ID for a user that is not the owner or team member', async () => {
		const authToken = await authorizedUserOneToken();
		await request(app)
			.get(`/projects/${projectTwo._id}`)
			.set('Authorization', authToken)
			.expect(400);
	});

	test('Should read all projects for user', async () => {
		const authToken = await authorizedUserOneToken();
		const response = await request(app)
			.get(`/projects`)
			.set('Authorization', authToken)
			.expect(200);
		expect(response.body.projects.length).toBe(1);
	});
});

describe('Updating Projects', () => {
	beforeEach(setUpDatabase);

	test('Should update name of project by id', async () => {
		const authToken = await authorizedUserOneToken();
		await request(app)
			.patch(`/projects/${projectOne._id}`)
			.set('Authorization', authToken)
			.send({ name: 'new project name' })
			.expect(200);
		const project = await Project.findById(projectOne._id);
		expect(project.name).not.toBe(projectOne.name);
	});

	test('Should not update project if changing unauthorized field like id', async () => {
		const authToken = await authorizedUserOneToken();
		await request(app)
			.patch(`/projects/${projectOne._id}`)
			.set('Authorization', authToken)
			.send({ _id: new mongoose.Types.ObjectId(), name: 'new project name' })
			.expect(400);
		const project = await Project.findById(projectOne._id);
		expect(project.name).toBe(projectOne.name);
	});
});

describe('Deleting Projects', () => {
	beforeEach(setUpDatabase);

	test('Should delete project by ID with authorized user', async () => {
		const authToken = await authorizedUserTwoToken();
		await request(app)
			.delete(`/projects/${projectTwo._id}`)
			.set('Authorization', authToken)
			.send()
			.expect(200);
		const project = await Project.findById(projectTwo._id);
		expect(project).toBeNull();
	});

	test('Should not delete project by ID with unauthorized user', async () => {
		const authToken = await authorizedUserTwoToken();
		await request(app)
			.delete(`/projects/${projectOne._id}`)
			.set('Authorization', authToken)
			.send()
			.expect(400);
		const project = await Project.findById(projectOne._id);
		expect(project).not.toBeNull();
	});
});

describe('Project authentication', () => {
	test('Should deny access to all project routes if not authenticated', async () => {
		await request(app)
			.get(`/projects`)
			.send()
			.expect(401);
		await request(app)
			.post(`/projects`)
			.send()
			.expect(401);
		await request(app)
			.get(`/projects/${projectOne._id}`)
			.send()
			.expect(401);
		await request(app)
			.patch(`/projects/${projectOne._id}`)
			.send()
			.expect(401);
		await request(app)
			.delete(`/projects/${projectOne._id}`)
			.send()
			.expect(401);
	});
});
