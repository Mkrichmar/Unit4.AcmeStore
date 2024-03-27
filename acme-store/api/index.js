const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/product', require('./product'));
router.use('/favorite', require('./favorite'));

module.exports = router;