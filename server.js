const express = require('express')
const app = express()
const Database = require('./Database')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const passport = require('passport')
const fg = require('./schema/ForumGeneral')

const http = require('http')
const server = http.createServer(app)

const { Server } = require('socket.io')
const io = new Server(server, {
   cors: {
     origin: "http://localhost:3000"
   }
})

io.on('connection', socket => {
   socket.on('chatMsg', msg => {
      const data = new Date()
      const hr = ('0' + data.getHours()).slice(-2)
      const min = ('0' + data.getMinutes()).slice(-2)
      
      io.emit('chatMsg', {...msg, data: `${hr}:${min}`})
   })
})

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
   const fgp = await fg.find()
   res.json(fgp[0].text)
})

app.use('/mailer', require('./routes/mailer'))
app.use('/api/news', require('./routes/news'))
app.use('/api/users', require('./routes/users'))
app.use('/api/forumgeneral', require('./routes/forumgeneral'))

/* -------------------------------------------------- */

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started at port ${PORT}`))