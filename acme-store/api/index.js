const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/product', require('./product'));

module.exports = router;