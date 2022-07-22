const express = require('express');
const router = express.Router();


// ---------- GET '/' AND REDIRECT TO HOME page----------
router.get('/', (req, res, next) => {
  res.redirect('/books');
  }
);


module.exports = router; 
