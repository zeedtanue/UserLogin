var express = require('express');
var router = express.Router();
var indexControll = require('../controllers/indexControll');

/* Member's Page */
router.get('/', indexControll.ensureAuthenticate, indexControll.getIndex);
module.exports = router;
