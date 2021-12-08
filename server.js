const express = require("express");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");

// Server Setup:
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Middleware (needed to view css/static files)
app.use(express.static(path.join(__dirname, "public")));

// API GET route (gets saved notes)
app.get("/api/notes", (req, res) => res.sendFile(path.join(__dirname, "./public/db/db.json")));

// API POST Route (add new notes to db.json)
app.post("/api/notes", (req, res) => {
  const savedNotes = JSON.parse(fs.readFileSync("./public/db/db.json"));
  const newNote = req.body;
  newNote.id = randomUUID();
  savedNotes.push(newNote);
  fs.writeFileSync("./public/db/db.json", JSON.stringify(savedNotes));
  res.json(savedNotes);
});

// API DELETE route (deletes selected note)
app.delete("/api/notes/:id", (req, res) => {
  const savedNotes = JSON.parse(fs.readFileSync("./public/db/db.json"));
  const id = req.params.id;
  const deleteNote = savedNotes.filter((savedNotes) => savedNotes.id === id);
  savedNotes.splice(deleteNote, 1);
  fs.writeFileSync("./public/db/db.json", JSON.stringify(savedNotes));
  res.json(savedNotes);
});

// HTML get routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "public/notes.html")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

// Listen on port
app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
