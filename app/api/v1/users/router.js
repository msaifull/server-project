const express = require('express');
const { getAllUsers } = require('./controller');
const router = express.Router();

/* GET users listing. */
router.get('/users',getAllUsers )

module.exports = router;
