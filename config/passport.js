const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { getUserByName, getUserById } = require('../db/queries');

passport.use(new LocalStrategy(
  async (username, password, done) => {
      try {
          //const result = await pool.query('SELECT * FROM pusers WHERE username = $1', [username]);
          const result = await getUserByName(username);
          const user = result;
          if (!user) return done(null, false, { message: 'Incorrect username.' });
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
          return done(null, user);
      } catch (err) {
          return done(err);
      }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
      //const result = await pool.query('SELECT * FROM pusers WHERE id = $1', [id]);
      const result = await getUserById(id);
      //console.log('result:' + result);
      done(null, result);
  } catch (err) {
      done(err);
  }
});
