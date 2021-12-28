const express = require('express');
const app = express();

require('dotenv/config');

app.get('/', (req,res) => {
   res.send('main')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));