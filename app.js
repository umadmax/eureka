const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/database');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect(db.mongoURI, {})
  .then( () => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override middleware
app.use(methodOverride('_method'));

// Express Session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Index Route
app.get('/', (req, res) => {
  const title = 'Eureka';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
