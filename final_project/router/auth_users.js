const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (userName)=>{ //returns boolean
    return users.some((user) => user.userName === userName);
}

const authenticatedUser = (userName,passWord)=>{ //returns boolean
    return users.some(
        (user) => user.userName === userName && user.passWord === passWord
      );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {userName, passWord} = req.body;

    if(!userName || !passWord) {
        return res.status(403).json({
            message: "Username and password are required"
        })
    }

    if(!authenticatedUser(userName,passWord)) {
        return res.status(401).json({
            message: "Invalid login"
        })
    }

    const accessToken = jwt.sign(
        {userName: userName},
        "access",
        {expiresIn: "1h"}
    );

    req.session.authorization = {
        accessToken:accessToken
    };

    return res.status(200).json({
        message: "User successfully logged in"
    })
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  
    if (!req.session.authorization) {
      return res.status(403).json({
        message: "User is not log in"
      });
    }
  
    const token = req.session.authorization.accessToken;
  
    try {
      const decoded = jwt.verify(token, "access");
      const username = decoded.userName; 
  
      const review = req.query.review;
  
      if (!review) {
        return res.status(400).json({
          message: "Review query parameter is required"
        });
      }
  
      if (!books[isbn]) {
        return res.status(404).json({
          message: "Book not found"
        });
      }
  
      if (!books[isbn].reviews) {
        books[isbn].reviews = {};
      }

      books[isbn].reviews[username] = review;
  
      return res.status(200).json({
        message: "Review added/updated successfully"
      });
  
    } catch (err) {
      return res.status(403).json({
        message: "Invalid token"
      });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;
  
    if (!username) {
      return res.status(401).json({ message: "User not logged in." });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully." });
    } else {
      return res.status(404).json({ message: "Review not found for this user." });
    }
  });;module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
