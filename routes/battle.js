const router    = require('express').Router();
const battleController = require('../controllers/battle')

router.get('/list', battleController.list);

router.get('/count', battleController.count);

router.get('/search', battleController.search);

router.get('/stats', battleController.stats);


module.exports = router