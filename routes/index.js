const express = require('express');
const router = express.Router();
const Book = require('../models').Book;  //data


//---------Handler function to wrap each route
function asyncHandler(callback){
  return async(req, res, next)=>{
	try{
		await callback(req, res, next);
		} catch(err){
			res.render('error', {error:err});
		}	
	}
}



// ---------- GET '/' AND REDIRECT TO HOME page----------
router.get('/', asyncHandler(async(req, res) => {
  res.redirect('/books');
  }
));

// ---------- GET home page----------
router.get('/books', asyncHandler(async(req, res) => {
	const books = await Book.findAll(); 
	res.render('index', { books });
	}
  ));


// ---------- GET new book form page----------
router.get('/books/new', asyncHandler(async(req, res) => {
	res.render('new-book', { book:{} });
	}
  ));

// ---------- POST new book page----------
router.post('/books/new', asyncHandler(async(req, res) => {
	let book;
	try {
		book = await Book.create(req.body);
		res.redirect('/');
	} catch (error) {
		console.log(error);
	}		
}));




module.exports = router; 
