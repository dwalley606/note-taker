const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');

const {
    readFromFile,
    writeToFile,
    readAndAppend,
} = require('../helpers/fsUtils');

notes.get('/', (req, res) => {
    console.log('GET request received');

    readFromFile('./db/db.json').then((data) => {
        res.json(JSON.parse(data));
    });
});

notes.post('/', (req, res) => {
    console.log('POST request received');

    const { title, text } = req.body;

    if (!title || !text) {
        res.status(400).send('The note is not properly formatted');
    } else {
        const newNote = {
            id: uuidv4(),
            title,
            text
        };

        readAndAppend(newNote, './db/db.json')
            .then(() => {
                res.send('Note added successfully');
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error adding note');
            });
    }
});

notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => {
            const notes = JSON.parse(data);
            const filteredNotes = notes.filter(note => note.id !== noteId);
            writeToFile('./db/db.json', filteredNotes);
            res.json({ message: 'Note deleted successfully' });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error deleting note');
        });
});

module.exports = notes;

