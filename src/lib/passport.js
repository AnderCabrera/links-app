const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new Strategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  console.log(req.body);
  
  await pool.query('SELECT * FROM users WHERE username = ?', [username], async (error, result) => {
    if (error) return error.code;

    if (result.length > 0) {
      const user = result[0];
      const validPassword = await helpers.matchPassword(password, user.password);

      if (validPassword) {
        done(null, user, req.flash('message', 'Welcome ' + user.username));
      } else {
        done(null, false, req.flash('message', 'Incorrect password'));
      }
    } else {
      return done(null, false, req.flash('message', 'Te user does not exists'));
    }
  });
}));

passport.use('local.signup', new Strategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  const { fullname } = req.body;
  
  const newUser = {
    username,
    password,
    fullname
  };

  newUser.password = await helpers.encryptPassword(password);

  await pool.query('INSERT INTO users SET ?', [newUser], (error, results) => {
    if (error) return error.code;

    newUser.id = results.insertId;
    return done(null, newUser);
  })
  
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  pool.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
    if (error) return error.code;

    done(null, results[0]);
  });

})
