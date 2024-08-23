require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const routes = require('./controllers/routes');
require('./config/passport');
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes go here...
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack to the console
    res.status(500).render('error', { error: err }); // Render an error page
  });
  

app.listen(3000, () => console.log('Server started on http://localhost:3000'));
