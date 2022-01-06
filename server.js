const express = require('express');
const app = express();

require('dotenv/config');

/**
 * ROUTES
 */
app.get('/', (req,res) => {
   res.send('main')
})

app.use('/mailer', require('./routes/mailer'))

/* -------------------------------------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));