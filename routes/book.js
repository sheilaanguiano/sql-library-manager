var express = require('express');
var router = express.Router();
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
	console.log(book);
	if(book !== null){
		res.render('update-book', { book })
	} else {
		const err = new Error();
		err.status = 404;
		res.render('page-not-found', { err });
	}

  }));


  // ---------- POST UPDATE book form----------
router.post("/books/:id", asyncHandler(async(req, res) => {
	let book;
	try {
		book = await Book.findByPk(req.params.id);
		if (book) {
			await book.update(req.body);
			res.redirect('/books');
		} else {
			res.render('page-not-found');
		}
	} catch(error) {
		if(error.name === "SequelizeValidationError"){
			book = await Book.build(req.body);
			book.id= req.body.id
			//Render the Form passing the errors to correct
			res.render('update-book', {book, errors: error.errors})
		} else {
			throw error;
		}
	}	
  }));  

// ---------- POST DELETE book form----------
router.post('/books/:id/delete', asyncHandler(async(req, res) =>{
	const book = await Book.findByPk(req.params.id);
	await book.destroy();
	res.redirect('/books');
  }))  


// -------- GET 500 Error page ------
/* Route to test 500 error */
router.get('/500error', (req, res) => {
	res.status = 500;
	throw new Error();
});



module.exports = router;
