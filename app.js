var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


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

app.use('/', indexRouter);
app.use('/users', usersRouter);

//   ------------ ERROR HANDLERs --------
/* 404 Error handler */
app.use((req, res, next) => {
	const err  = new Error('Not Found');
	err.status = 404;
	// console.log('Error 404 - Not Found');
	next(err);
	// res.status(404).render('not-found');
});

/* Global error handler*/ 
app.use((err, req, res, next) => {	
	if (err.status === 404) {
		// err.status = 404;
		err.message = 'Not Found';
		console.log('Error 404 - Page Not Found (-ω-、)');
		res.status(404).render('not-found', { err });
	} else {
		err.message = `Oops! something is wrong with the server`;
		err.status = 500;
		console.log('Error 500 - Something is wrong with the server 	(ﾉω･､)');
		res.render('error', { err });
		}
	});







// PROVIDED BY EXPRESS: catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// PROVIDED BY EXPRESS: error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


app.listen(3000, () => {
	console.log('The application is running on localhost:3000!')
});

module.exports = app;
