// test/notes.test.js
const request = require('supertest');
const express = require('express');
const notesRouter = require('../../routes/notes');
const fsUtils = require('../../helpers/fsUtils');

jest.mock('../../helpers/fsUtils');

describe('Notes Router', () => {
  const app = express();
  app.use(express.json()); // Middleware to parse JSON bodies
  app.use('/notes', notesRouter);

  describe('GET /notes', () => {
    it('should return all notes', async () => {
      const mockData = JSON.stringify([{ id: '1', title: 'Test Note', text: 'This is a test' }]);
      fsUtils.readFromFile.mockResolvedValue(mockData);

      const response = await request(app).get('/notes');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(JSON.parse(mockData));
    });
  });

  describe('POST /notes', () => {
    it('should add a new note', async () => {
      const newNote = { title: 'New Note', text: 'Content of new note' };
      fsUtils.readAndAppend.mockResolvedValue();

      const response = await request(app).post('/notes').send(newNote);
      expect(response.status).toBe(200);
      expect(response.text).toBe('Note added successfully');
    });

    it('should return 400 if note is improperly formatted', async () => {
      const newNote = { title: 'Incomplete Note' };

      const response = await request(app).post('/notes').send(newNote);
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should delete a note', async () => {
      const noteId = '1';
      fsUtils.readFromFile.mockResolvedValue(JSON.stringify([{ id: noteId, title: 'Note', text: 'Delete me' }]));
      fsUtils.writeToFile.mockResolvedValue();

      const response = await request(app).delete(`/notes/${noteId}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Note deleted successfully' });
    });
  });
});