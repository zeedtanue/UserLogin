const express = require('express');
const router = express.Router();

const indexControll = require('../controllers/indexControll');

/* Member's Page */
router.get('/', indexControll.ensureAuthenticate, indexControll.getIndex);
module.exports = router;
