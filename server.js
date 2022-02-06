const express = require('express');
const app = express();
const Database = require('./Database');
const session = require('express-session')
const mongoStore = require('connect-mongo')
const passport = require('passport')
const User = require('./schema/User')
const News = require('./schema/News')

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
   const us = new News({
      title: 'Test Quam nihil molestiae consequatur illum.',
      shortTitle: "Nihil velillum",
      image: 'https://eweszlo.pl/wp-content/uploads/2020/12/ancient_4.jpg',
      tags: ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet'],
      category: 'Discoveries',
      text: `Nulla facilisi. Ut in ultricies urna. Vestibulum aliquet dignissim leo, eget congue urna consequat sed. Suspendisse eu sapien sed purus cursus aliquam. Ut vitae sodales mi, vitae eleifend purus. Donec imperdiet turpis urna, non fringilla ante lobortis sed. Nullam eget facilisis urna, id molestie tortor. Vestibulum vel suscipit enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam facilisis porttitor accumsan.

      Praesent lobortis dapibus arcu, mollis posuere odio. Mauris id ipsum et metus dictum cursus non eu ex. Phasellus congue vulputate sodales. Ut ut tempus velit. Donec a finibus velit, vel convallis sem. Sed vitae elit sit amet velit ullamcorper tincidunt. Etiam rhoncus, nulla nec aliquet sodales, risus tortor venenatis enim, non imperdiet purus magna id augue. Pellentesque placerat tincidunt massa ac pretium. Proin metus ipsum, mattis a mollis eget, pharetra at ipsum. In vitae lacus scelerisque magna dapibus finibus quis at enim. Sed non massa luctus, rutrum quam et, tristique ipsum. Integer consequat elit vestibulum tempor accumsan.`,
      author: {
         firstname: 'Firstname',
         lastname: 'Lastname',
         nickname: 'vrecek',
      }
   })
   us.save()
   const users = await User.find()
   res.json(users.length)
})

app.use('/mailer', require('./routes/mailer'))
app.use('/api/news', require('./routes/news'))
app.use('/api/users', require('./routes/users'))

/* -------------------------------------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));