const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


// GET request for notes localhost:3001/api/notes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      res.json(parsedData);
    }
  });
});


// POST request to add a note localhost:3001/api/notes
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    // read notes from file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        // push new note to array of notes
        parsedNotes.push(newNote);

        // write all notes back to file
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), (err,data) => {
            if (err) {
                console.error(err);
            }else {
                console.info("Updated file with new note!");
            }
        });
      }
    });
    res.status(201).json('Post was successful');
  } else {
    res.status(500).json('Error in posting note');
  }
});


// GET route for wildcard - direct users to homepage (put at bottom of code!!)
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);