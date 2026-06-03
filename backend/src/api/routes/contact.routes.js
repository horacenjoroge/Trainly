const { Router } = require('express');
const { authMiddleware } = require('../../middleware/auth');
const contactController = require('../controllers/contact.controller');
const { validateRequest } = require('../validators');
const { contactBodySchema, contactIdParamSchema, sosBodySchema } = require('../validators/contact.validator');

const router = Router();
router.use(authMiddleware);

router.get('/', contactController.list);
router.post('/', validateRequest({ body: contactBodySchema }), contactController.create);
router.put('/:id', validateRequest({ params: contactIdParamSchema, body: contactBodySchema }), contactController.update);
router.delete('/:id', validateRequest({ params: contactIdParamSchema }), contactController.remove);
router.post('/send-sos', validateRequest({ body: sosBodySchema }), contactController.sendSOS);

module.exports = router;
