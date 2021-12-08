const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const { networkInterfaces } = require("os");
const { randomUUID } = require("crypto");
// Server Setup:
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to allow  express to access the body (object : true)
app.use(express.urlencoded({ extended: true }));
// To process and parse json info, same as url encoded but allows json from body
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
app.delete("api/notes:id", (req, res) => {});

// HTML get routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "public/notes.html")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

// Listen on port
app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
