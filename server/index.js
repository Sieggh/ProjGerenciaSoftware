const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const userRoutes = require('./routes/api/users');
require('dotenv').config();
const path = require('path');

app.use(cors()) // to allow cross origin requests
app.use(express.json());


mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
    .then(() => console.log('MongoDB database Connected...'))
    .catch((err) => console.log(err))

app.use('/api/users', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(process.env.PORT, () => console.log(`App listening at http://localhost:${process.env.PORT}`))