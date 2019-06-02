const request = require('supertest');
const app = require('../src/app');

test('Should create server and connect successfully at root', async () => {
	await request(app)
		.get('/')
		.send()
		.expect(200);
});
