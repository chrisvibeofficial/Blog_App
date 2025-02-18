const { register, getUsers, getUser, deleteUser, updateUser } = require('../controllers/userController');
const upload = require('../utils/multer')
const router = require('express').Router();

router.post('/users', upload.single('profile'), register);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', upload.single('profile'), updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router