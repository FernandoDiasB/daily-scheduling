const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const mongoose = require('mongoose');
const app = express();

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    })

app.get('/', (req, res) => {
    res.send('Its alive!!')
});



const port = 3000;
app.listen(port, () => {
    console.log('Connected Server !!')
})