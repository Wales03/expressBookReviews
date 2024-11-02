const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const doesExist = (username) => {
        let userswithsamename = users.filter((user) => {
            return user.username === username;
        });
        if (userswithsamename.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
        const allbooks = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books);
              },4000)
        });
  return res.status(300).json({allbooks});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {

        setTimeout(() => {
            resolve(books[isbn]);
          },4000)
    });
  return res.status(300).json({book});
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author
   
    const book = await new Promise((resolve, reject) => {

        setTimeout(() => {
            resolve(Object.values(books).filter((item,index)=>{
                return item.author === author
            }));
          },4000)
    });
    
  return res.status(300).json({book});
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title
    const array= Object.values(books)
    const book = await new Promise((resolve, reject) => {

        setTimeout(() => {
            resolve(array.filter((item,index)=>{
                return item.title === title
            }));
          },4000)
    });
   
    
  return res.status(300).json({book});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    const book = books[isbn].reviews
  return res.status(300).json({reviews:book});
});

module.exports.general = public_users;
