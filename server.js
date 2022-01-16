const express = require('express');
const app = express();
const Database = require('./Database');
const session = require('express-session')
const mongoStore = require('connect-mongo')
const passport = require('passport')
const User = require('./schema/User')

require('dotenv/config');

/**
 * DATABASE
 */
(async function connectDb(){
   const db = new Database(process.env.DB)
   await db.connect()
}())

/**
 * MIDDLEWARE
 */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
   secret: process.env.SECRET,
   resave: false,
   saveUninitialized: true,
   store: mongoStore.create({
      mongoUrl: process.env.DB
   }),
   cookie: {
      maxAge: 1000 * 60
   }
}))
require('./Passport')
app.use(passport.initialize())
app.use(passport.session())
/* -------------------------------------------------- */

/**
 * ROUTES
 */
app.get('/', async (req,res) => {
   const isauth = req.isAuthenticated()
   res.json(isauth)
})

app.use('/mailer', require('./routes/mailer'))
app.use('/api/news', require('./routes/news'))
app.use('/api/users', require('./routes/users'))

/* -------------------------------------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));