var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const routes = require('./routes/index');
const book = require('./routes/book');


var app = express();

//Including Sequelize to the project
const Sequelize = require('sequelize');
//Instatiate Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db',
  logging: false
});

//async IIFE (Immediately Invoked Function Expression)
(async () => {
  try {
    await sequelize.sync();
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();



// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');
app.use('/static', express.static('public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/', book);

//   ------------ ERROR HANDLERs --------
/* 404 Error handler to catch undefined or non-existent */
app.use((req, res, next) => {
	res.status = 404;
	next(err);
});

/* Global error handler*/ 
app.use((err, req, res, next) => {	
	if (err.status === 404) {
		res.status(404).render('page-not-found', { err });
	} else {
		res.status = 500;
		console.log('Error 500 - Something is wrong with the server 	(ﾉω･､)');
		res.render('page-error');
		}
	});


app.listen(3000, () => {
	console.log('The application is running on localhost:3000!')
});

module.exports = app;
