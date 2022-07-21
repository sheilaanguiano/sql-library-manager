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


// ---------- GET (READ)new book form page----------
router.get('/books/new', asyncHandler(async(req, res) => {
	res.render('new-book', { book:{} });
	}
  ));

// ---------- POST CREATE new book ----------
router.post('/books/new', asyncHandler(async(req, res) => {
	let book;
	try {
		book = await Book.create(req.body);
		res.redirect('/');
	} catch (error) {
		if(error.name === "SequelizeValidationError"){
			book = await Book.build(req.body);
			res.render('new-book', {book, errors: error.errors})
		} else {
			throw error; //error caught in the asyncHandler's catch block
		}
	}		
}));

// ------ GET  (READ )book to UPDATE or DELETE form--------
router.get('/books/:id', asyncHandler(async(req, res) => {
	const book = await Book.findByPk(req.params.id);
	if(book){
		res.render('update-book', { book })
	}
  }));

  // ---------- POST UPDATE book form----------
router.post("/books/:id", asyncHandler(async(req, res) => {
	let book;
	try {
		book = await Book.findByPk(req.params.id);
		if(book){
			await book.update(req.body);
			res.redirect('/books');
		} else {
			console.log('Not Found');
		}
	} catch(error) {
		if(error.name === "SequelizeValidationError"){
			book = await Book.build(req.body);
			book.id= req.body.id
			res.render('/books/:id', {book, errors: error.errors})
		} else {
			throw error;
		}
	}	
  }));  

   // ---------- POST DELETE book form----------
router.post('/books/:id/delete', asyncHandler(async(req, res) => {
	const book = await Book.findByPk(req.params.id);
	if(book){
		await book.destroy();
		res.redirect('/books');
	} 		
}));  

 


module.exports = router; 
