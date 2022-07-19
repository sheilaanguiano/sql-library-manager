const express = require('express');
const router = express.Router();
const Book = require('../models').Book;  //data


//---------Async/await middleware handler
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
/* GET home page. */
router.get('/', asyncHandler(async(req, res) => {
  const books = await Book.findAll(); 
  res.render('index', { books });
  }
));

module.exports = router;
