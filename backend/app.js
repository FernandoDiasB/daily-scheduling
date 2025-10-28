const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// 🔥 Habilita CORS para o frontend
app.use(cors({
  origin: 'http://localhost:5173', // ou '*' para liberar tudo (não recomendado em produção)
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

//mongodb connection
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    })

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Its alive!!')
});

app.use('/api/auth', require('./routes/authRoutes.js'))
app.use('/api/user', require('./routes/userRoutes.js'))
app.use('/api/appointments', require('./routes/appointmentsRoutes.js'))
app.use('/api/patients', require('./routes/patientRoutes.js'))



const port = 3000;
app.listen(port, () => {
    console.log('Connected Server !!')
})