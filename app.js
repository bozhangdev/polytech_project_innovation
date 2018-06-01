let createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    logger = require('morgan'),
    bodyParser = require('body-parser');


let indexRouter = require('./routes/index'),
    usersRouter = require('./routes/user'),
    signUp = require('./routes/signup'),
    newProduct = require('./routes/new_product'),
    logIn = require('./routes/logIn'),
    logOut = require('./routes/logOut'),
    product = require('./routes/product'),
    searchFor = require('./routes/search_for_product'),
    checkOut = require('./routes/checkout'),
    auction = require('./routes/auction');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser('user log in session'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'user log in session',
    cookie: {maxAge: 1800000},
    resave: true,
    saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/signup', signUp);
app.use('/user', usersRouter);
app.use('/new-product', newProduct);
app.use('/login', logIn);
app.use('/logout', logOut);
app.use('/search', searchFor);
app.use('/product', product);
app.use('/auction', auction);
app.use('/checkout', checkOut);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
