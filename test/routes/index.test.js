// test/index.test.js or alongside your index.js
const request = require('supertest');
const express = require('express');
const notesRouter = require('../../routes/notes');
const indexRouter = require('../../routes/index');

jest.mock('../../routes/notes', () => {
  const express = require('express');
  const mockRouter = express.Router();
  mockRouter.get('/', (req, res) => res.send('Notes Route'));
  return mockRouter;
});

describe('Index Router', () => {
  it('should use the notes router for /notes path', async () => {
    const app = express();
    app.use(indexRouter);

    const response = await request(app).get('/notes');
    expect(response.text).toBe('Notes Route');
    expect(response.statusCode).toBe(200);
  });
});