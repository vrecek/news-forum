const User = require('./schema/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Database = require('./Database')

const verifyCallback = (username, password, done) => {
   User.findOne({ username: username })
       .then(user => {
          if(!user) return done(null, false)

          const db = new Database(process.env.DB, { User: User })
          const isValid = db.verifyHash(password, user.hash, user.salt)

          if(isValid) return done(null, user)
          else return done(null, false)
       })
       .catch(err => done(err))
}

const strategy = new LocalStrategy(verifyCallback)
passport.use(strategy)

passport.serializeUser(function(user, done) {
   done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
   User.findById(id)
   .then((user) => {
      done(null,user)
   })
   .catch((err) => done(err))
 });