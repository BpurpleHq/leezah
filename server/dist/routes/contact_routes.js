"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// const { authToken }  = require ('../middleware/auth_middleware');
const { saveContact, getContacts, deleteContact } = require('../controllers/contact_controller');
const router = (0, express_1.Router)();
// Protected routes
router.post('/', saveContact);
router.get('/', getContacts);
router.delete('/:contactId', deleteContact);
module.exports = router;
