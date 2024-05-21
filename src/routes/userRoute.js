const express = require('express');
const router = express.Router();

const {authUser, authIsAdmin} = require('../middlewares/authUser')
const userCtrl = require('../controllers/userCtrl')

router.post('/register', userCtrl.createUser)
router.post('/login', userCtrl.loginUser)
router.get('/logout', userCtrl.logoutUser)
router.get('/refresh', userCtrl.refreshToken)
router.put('/update/:id', authUser, userCtrl.updateUser)
router.delete('/delete/:id', authUser, authIsAdmin, userCtrl.deleteUser)
router.get('/user/:id', userCtrl.findUser)
router.put('/block-user', userCtrl.blockUser)
router.get('/info-user', authUser, userCtrl.getInfoUser)
router.get('/all-users', userCtrl.getAllUsers)

module.exports = router;