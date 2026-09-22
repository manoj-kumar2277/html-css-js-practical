const router = require('express').Router();
const controller = require('../controllers/itemController');

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', controller.create);

module.exports = router;
