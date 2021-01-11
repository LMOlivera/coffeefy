const express = require('express');
const router = new express.Router();

router.get('/home', async (req, res) => {
    console.log(req);
    res.render('home', {user: req.session.name});
})

module.exports = router;