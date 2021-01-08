// Node Modules
const express = require('express');
const hbs  = require('hbs');
const path = require('path');
const app = express();
require('../db/mongoose'); //?

// Routers
const userRouter = require('../routers/user');
const loginRouter = require('../routers/login');

// Paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlerbars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// Parse body
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Set routers
app.use(loginRouter);

app.get('/', (req, res) => {
    res.render('index');
})

module.exports = app;