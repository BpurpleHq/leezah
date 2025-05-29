import { Router } from 'express';
const { authToken }  = require ('../middleware/auth_middleware');
const {
  registerUser,
  getAllUsers,
  getUserById,
  updateUserProfile,
  loginUser,
  deleteUser
} = require("../controllers/user_controller");

const router = Router();

router.post('/', registerUser)
router.get('/users', authToken, getAllUsers)
router.get('/user/:id', authToken, getUserById)
router.put('/user/:id/profile', updateUserProfile);
router.post('/login', loginUser);
router.delete('/user/:id', deleteUser);


module.exports = router
