import { Router } from 'express';
// const { authToken }  = require ('../middleware/auth_middleware');
const { saveContact, getContacts, deleteContact } = require ('../controllers/contact_controller');

const router = Router();

// Protected routes
router.post('/', saveContact);
router.get('/', getContacts);
router.delete('/:contactId', deleteContact);

module.exports = router;