const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const auth = require('./middlewares/auth');

router.post('/user-register',userController.register);
router.post('/user-login',userController.login);
router.get('/verify-user', auth,userController.verifyUser);
router.post('/logout', auth,userController.logout);

router.get('/home',auth,(req,res)=>{
  const user = req.user;
  res.status(200).json({user});
});

module.exports = router;
