/**
 * Name:     Calvin Jun Zhong Lim
 * Date:     May 19, 2022
 * Section:  CSE 154 AB
 *
 * This is the Node.js to implement the server-side for cp4.
 * It includes the list of Javascript object that contains book metadatas.
 * It contains error handling and path handling in and API call.
 */

"use strict";

const express = require("express");
const app = express();

const multer = require("multer");
app.use(express.urlencoded({estended: true}));
app.use(express.json());
app.use(multer().none()); // for FormData

let BOOK_SUMMARIES = [
  {
    "id": 1,
    "title": "10% Happier",
    "author": "Dan Harris",
    "summary": "Practicing meditation and mindfulness will make you at least 10 percent happier. \
    Being mindful doesn’t change the problems in your life, but mindfulness does help you respond \
    to your problems rather than react to them. Mindfulness helps you realize that striving for \
    success is fine as long as you accept that the outcome is outside your control."
  },
  {
    "id": 2,
    "title": "The 10X Rule",
    "author": "Grant Cardone",
    "summary": "The 10X Rule says that 1) you should set targets for yourself that are 10X greater \
    than what you believe you can achieve and 2) you should take actions that are 10X greater than \
    what you believe are necessary to achieve your goals. The biggest mistake most people make in \
    life is not setting goals high enough. Taking massive action is the only way to fulfill your \
    true potential."
  },
  {
    "id": 3,
    "title": "A Short Guide to a Happy Life",
    "author": "Anna Quindlen",
    "summary": "The only thing you have that nobody else has is control of your life. The hardest \
    thing of all is to learn to love the journey, not the destination. Get a real life rather than \
    frantically chasing the next level of success."
  },
  {
    "id": 4,
    "title": "A Technique for Producing Ideas",
    "author": "James Webb Young",
    "summary": "An idea occurs when you develop a new combination of old elements. The capacity to \
    bring old elements into new combinations depends largely on your ability to see relationships. \
    All ideas follow a five-step process of 1) gathering material, 2) intensely working over the \
    material in your mind, 3) stepping away from the problem, 4) allowing the idea to come back to \
    you naturally, and 5) testing your idea in the real world and adjusting it based on feedback."
  },
  {
    "id": 5,
    "title": "The Art of War",
    "author": "Sun Tzu",
    "summary": "Know when to fight and when not to fight: avoid what is strong and strike at what \
    is weak. Know how to deceive the enemy: appear weak when you are strong, and strong when you \
    are weak. Know your strengths and weaknesses: if you know the enemy and know yourself, you \
    need not fear the result of a hundred battles."
  },
  {
    "id": 6,
    "title": "The Compound Effect",
    "author": "Darren Hardy",
    "summary": "The compound effect is the strategy of reaping huge rewards from small, seemingly \
    insignificant actions. You cannot improve something until you measure it. Always take 100 \
    percent responsibility for everything that happens to you."
  }
];

// returns a JSON response containing a list of all books and their metadatas
app.get("/book-summaries/all", (req, res) => {
  res.json(BOOK_SUMMARIES);
});

// returns a JSON response containing a book's metadata based on the id being passed in params.
app.get("/book-summaries/:id", (req, res) => {
  let id = req.params.id;
  let found = false;
  res.type("text");

  if (BOOK_SUMMARIES) {
    if (parseInt(id)) {
      BOOK_SUMMARIES.forEach((entry) => {
        if (entry.id === parseInt(id)) {
          found = true;
        }
      });
      if (found) {
        res.json(BOOK_SUMMARIES[id - 1]);
      } else {
        res.status(400);
        res.send("Given id: " + id + " not found.");
      }
    } else {
      res.status(400);
      res.send("Param is not set properly. (integer only)");
    }
  } else {
    res.status(500);
    res.send("Uh oh. Something went wrong. Please try again later.");
  }
});

// returns a plain text containing a book title based on the id passed in params.
app.get("/book/:id", (req, res) => {
  let id = req.params.id;
  let found = false;
  res.type("text");

  if (parseInt(id)) {
    BOOK_SUMMARIES.forEach((entry) => {
      if (entry.id === parseInt(id)) {
        found = true;
      }
    });
    if (found) {
      res.send(BOOK_SUMMARIES[id - 1].title);
    } else {
      res.status(400);
      res.send("Given id: " + id + " not found.");
    }
  } else {
    res.status(400);
    res.send("Param is not set properly.");
  }
});

// adds a book and its metadatas into BOOK_SUMMARIES
app.post("/add-book", (req, res) => {
  let id = BOOK_SUMMARIES.length + 1;
  let title = req.body.title;
  let author = req.body.author;
  let summary = req.body.summary;
  let found = false;
  res.type("text");

  if (title && author && summary) {
    BOOK_SUMMARIES.forEach((entry) => {
      if (entry.title === title) {
        found = true;
      }
    });
    if (!found) {
      let book = bookObject(id, title, author, summary);
      BOOK_SUMMARIES[id - 1] = book;
      res.send("Success! " + title + "'s summary has been added.");
    } else {
      res.status(400);
      res.send(title + "'s summary has already been added.");
    }
  } else {
    res.status(400);
    res.send("Body param not set properly.");
  }
});

/**
 * Helper function that constructs a book object.
 * @param {integer} id - Book ID.
 * @param {string} title - Book title name.
 * @param {string} author - Author of the book.
 * @param {string} summary - 3 sentence summary of the book.
 * @return {object} Object containing a book's metadata (id, title, author, sumamry).
 */
function bookObject(id, title, author, summary) {
  return {
    "id": id,
    "title": title,
    "author": author,
    "summary": summary
  };
}

app.use(express.static("public"));
const localHost = 8000;
const PORT = process.env.PORT || localHost;
app.listen(PORT);