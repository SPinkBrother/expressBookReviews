const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const userName = req.body.userName;
    const passWord = req.body.passWord;
  
    if(!userName || !passWord) {
      return res.status(400).json({
          message: "Username and passWord required"
      });
    }
  
    const userExists = users.find((user) => user.userName === userName);
    if(userExists) {
      return res.status(400).json({
          message: "Username already exist"
      });
    }
  
    users.push({
      userName: userName,
      passWord: passWord
    });
  
    return res.status(200).json({
      message: "New account created"
    })
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null , 4));
  });
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({
          message: "Book not found"
        });
      }
    
      return res.status(200).json(book);
 });
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    let result = {};

    Object.keys(books).forEach((key) => {
        if(books[key].author === author) {
            result[key] = books[key];
        }
    });

    if(Object.keys(result).length === 0) {
        return res.status(404).json({
            message: "No books found for this author"
        })
    }
    return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
  
    let result = {};

    Object.keys(books).forEach((key) => {
        if(books[key].title === title) {
            result[key] = books[key];
        }
    });

    if(Object.keys(result).length === 0) {
        return res.status(404).json({
            message: "No books found with this title"
        })
    }
    return res.status(200).json(result);

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn].reviews;

  return res.status(200).send(book);
});
module.exports.general = public_users;
