// test/helpers/fsUtils.test.js
const fs = require('fs');
const { readFromFile, writeToFile, readAndAppend } = require('../../helpers/fsUtils');

// Properly mock the fs module including the promises API
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  },
  readFile: jest.fn(),
  writeFile: jest.fn()
}));

describe('fsUtils', () => {
  describe('readFromFile', () => {
    it('should read data from file', async () => {
      const fakeData = JSON.stringify([{ id: 1, title: "Test Note" }]);
      fs.promises.readFile.mockResolvedValue(fakeData);

      const data = await readFromFile('dummyfile.json');
      expect(data).toBe(fakeData);
    });
  });

  describe('writeToFile', () => {
    it('should write data to file', async () => {
      const content = [{ id: 1, title: "Test Note" }];
      const fakePath = 'path/to/file.json';
      fs.promises.writeFile.mockResolvedValue();

      await writeToFile(fakePath, content);
      expect(fs.promises.writeFile).toHaveBeenCalledWith(fakePath, JSON.stringify(content, null, 4));
    });
  });

  describe('readAndAppend', () => {
    it('should read from a file and append content', async () => {
      const existingData = [{ id: 1, title: "Existing Note" }];
      const newData = { id: 2, title: "New Note" };
      const fakePath = 'path/to/file.json';

      fs.promises.readFile.mockResolvedValue(JSON.stringify(existingData));
      fs.promises.writeFile.mockResolvedValue();

      await readAndAppend(newData, fakePath);

      expect(fs.promises.writeFile).toHaveBeenCalledWith(fakePath, JSON.stringify([...existingData, newData], null, 4));
    });
  });
});