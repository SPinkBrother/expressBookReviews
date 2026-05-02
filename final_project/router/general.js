const express = require('express');
const axios = require('axios');
const public_users = express.Router();
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

/**
 * User registration route
 * Accepts POST requests with username and password in the request body
 * Validates that both username and password are provided
 * Prevents duplicate usernames from being registered
 * Returns 200 on success or 400 if validation fails
 */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (users.hasOwnProperty(username)) {
    return res.status(400).json({ message: "Username already exists." });
  }
  users[username] = password;
  return res.status(200).json({ message: "User registered successfully." });
});

/**
 * GET root route using Promise
 * Retrieves the entire book list from the database
 * Uses Promise to simulate async operation
 * Returns: 200 with complete book list on success, 500 if an error occurs
 * This demonstrates promise-based async handling pattern
 */
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((bookList) => {
    res.status(200).json(bookList);
  })
  .catch((error) => {
    res.status(500).json({ message: "Error retrieving book list." });
  });
});

/**
 * GET /async-books route using async/await with Axios
 * Fetches the book list from the server using Axios HTTP client
 * Demonstrates modern async/await pattern for making HTTP requests
 * Makes a GET request to the root endpoint and returns the response data
 * Returns: 200 with complete book list on success, 500 if request fails
 * Note: Assumes server is running on localhost:5000
 */
public_users.get('/async-books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/'); // Assuming the current server is running on port 5000
    const bookList = response.data;
    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book list." });
  }
});

/**
 * GET /isbn/:isbn route using Promise
 * Retrieves a specific book by its ISBN number
 * Uses Promise with explicit resolve/reject handlers
 * Validates that the book exists in the database before returning
 * Returns: 200 with book data on success, 404 if book not found
 */
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found.");
    }
  })
  .then((book) => {
    res.status(200).json(book);
  })
  .catch((error) => {
    res.status(404).json({ message: error });
  });
});

/**
 * GET /async-isbn/:isbn route using async/await with Axios
 * Fetches a specific book by ISBN using Axios HTTP client
 * Demonstrates async/await error handling with try/catch
 * Makes an HTTP request to the /isbn endpoint and returns the response
 * Returns: 200 with book data on success, 404 if book not found
 * Note: Assumes server is running on localhost:5000
 */
public_users.get('/async-isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`); // Assuming the current server is running on port 5000
    const book = response.data;
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: "Book not found." });
  }
});

/**
 * GET /author/:author route using Promise
 * Retrieves all books by a specific author
 * Converts author parameter to lowercase for case-insensitive matching
 * Filters the books database by comparing each book's author (case-insensitive)
 * Returns: 200 with array of matching books on success, 404 if no books found
 * Uses Promise pattern with array mapping and filtering operations
 */
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    const booksByAuthor = bookKeys
      .map(key => books[key])
      .filter(book => book.author.toLowerCase() === author);
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("Books by this author not found.");
    }
  })
  .then((books) => {
    res.status(200).json(books);
  })
  .catch((error) => {
    res.status(404).json({ message: error });
  });
});

/**
 * GET /async-author/:author route using async/await with Axios
 * Fetches all books by a specific author using Axios HTTP client
 * Converts author parameter to lowercase for case-insensitive comparison
 * Makes an HTTP request to the /author endpoint and returns matching books
 * Returns: 200 with array of matching books on success, 404 if no books found
 * Demonstrates modern async/await pattern with error handling
 * Note: Assumes server is running on localhost:5000
 */
public_users.get('/async-author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`); // Assuming the current server is running on port 5000
    const booksByAuthor = response.data;
    res.status(200).json(booksByAuthor);
  } catch (error) {
    res.status(404).json({ message: "Books by this author not found." });
  }
});

/**
 * GET /title/:title route using Promise
 * Retrieves all books with a specific title
 * Converts title parameter to lowercase for case-insensitive matching
 * Iterates through all books and filters by exact title match (case-insensitive)
 * Returns: 200 with array of matching books on success, 404 if no books found
 * Useful for finding books when ISBN or author is unknown
 */
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    const booksWithTitle = bookKeys
      .map(key => books[key])
      .filter(book => book.title.toLowerCase() === title);
    if (booksWithTitle.length > 0) {
      resolve(booksWithTitle);
    } else {
      reject("Books with this title not found.");
    }
  })
  .then((books) => {
    res.status(200).json(books);
  })
  .catch((error) => {
    res.status(404).json({ message: error });
  });
});

/**
 * GET /async-title/:title route using async/await with Axios
 * Fetches all books with a specific title using Axios HTTP client
 * Converts title parameter to lowercase for case-insensitive matching
 * Makes an HTTP request to the /title endpoint and returns matching books
 * Returns: 200 with array of matching books on success, 404 if no books found
 * Demonstrates async/await error handling pattern for HTTP requests
 * Note: Assumes server is running on localhost:5000
 */
public_users.get('/async-title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`); // Assuming the current server is running on port 5000
    const booksWithTitle = response.data;
    res.status(200).json(booksWithTitle);
  } catch (error) {
    res.status(404).json({ message: "Books with this title not found." });
  }
});

/**
 * GET /review/:isbn route
 * Retrieves all reviews for a specific book by ISBN
 * First validates that the book exists in the database
 * Then checks if reviews are available for that book
 * Returns: 200 with reviews object on success
 *          404 if book not found, or if book exists but has no reviews
 * This endpoint is synchronous and doesn't use Promises/async-await
 * Provides immediate access to customer feedback for books
 */
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }
  if (!book.reviews) {
    return res.status(404).json({ message: "Reviews not found for this book." });
  }
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;