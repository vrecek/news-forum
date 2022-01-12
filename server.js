const express = require('express');
const app = express();
const Database = require('./Database');
const News = require('./schema/News');

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
/* -------------------------------------------------- */

/**
 * ROUTES
 */
app.get('/', (req,res) => {
   res.send('main')
})

app.use('/mailer', require('./routes/mailer'))
app.use('/api/news', require('./routes/news'))
app.use('/api/users', require('./routes/users'))

/* -------------------------------------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));