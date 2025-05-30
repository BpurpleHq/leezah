import { Router } from 'express';
const { authToken }  = require ('../middleware/auth_middleware');
const { generateShareableLink, revokeShareableLink, viewSharedCard } = require ('../controllers/card_sharing');
const {
  createDigitalCard,
  updateDigitalCard,
  deleteDigitalCard,
  getDigitalCards,
  getDigitalCardById,
} =  require ('../controllers/card_management');

const router = Router();

// Protected routes
router.post('/:cardId/share', authToken, generateShareableLink);
router.post('/:cardId/unshare',  revokeShareableLink);
router.post('/',authToken ,createDigitalCard);
router.put('/:cardId', updateDigitalCard);
router.delete('/:cardId', deleteDigitalCard);
router.get('/', authToken, getDigitalCards);
router.get('/:cardId', authToken, getDigitalCardById);

// Public route
router.get('/view/:cardId', viewSharedCard);

module.exports = router;