const fs = require('fs');
const util = require('util');

// Promise version of fs.readFile that also parses JSON
const readFromFile = async (filePath) => {
  const readFile = util.promisify(fs.readFile);
  try {
    const data = await readFile(filePath, 'utf8'); // Ensure encoding is set to get a string
    return JSON.parse(data); // Parse and return the JSON data
  } catch (error) {
    console.error(`Error reading from ${filePath}:`, error);
    throw error; // Rethrow to allow caller to handle
  }
};
/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          try {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
            resolve();
          } catch (error) {
            console.error(error);
            reject(error);
          }
        }
      });
    });
  };

module.exports = { readFromFile, writeToFile, readAndAppend };
