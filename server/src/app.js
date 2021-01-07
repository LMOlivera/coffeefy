const express = require('express');
require('../db/mongoose');
const userRouter = require('../routers/user');

const app = express();

app.use(userRouter);

app.get('', (req, res) => {
    res.send("Placeholder");
})

module.exports = app;