const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
            "username":"test",
    "password":"test123"
    }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

  const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
 
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn =req.params.isbn
 const reviewMessage = req.body.reviewMessage
  const book = books[isbn]
  book.reviews[req.session.authorization.username] = reviewMessage

  return res.status(300).json({book});
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn =req.params.isbn
     const book = books[isbn]
     const reviews = Object.values(book.reviews)
    delete book.reviews[req.session.authorization.username]
   
     return res.status(300).json({book});
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
