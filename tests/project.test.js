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
			.get(`/projects/${projectOne._id}`)
			.set('Authorization', authToken)
			.expect(200);
		expect(response.body.projects.length).toBe(1);
	});
});

// describe('Updating Projects', () => {
// 	beforeEach(setUpDatabase)

// 	test('Should update name of project', async () => {
// 		const authToken = await authorizedUserOneToken()
// 		await request(app).patch(`/projects/$`)
// 	})
// })
