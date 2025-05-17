const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const shopController = require('./controllers/shopController');
const auth = require('./middlewares/auth');
const uploadImage = require('./middlewares/uploadImage');

// Auth Routes
router.post('/user-register',userController.register);
router.post('/user-login',userController.login);
router.get('/verify-user', auth,userController.verifyUser);
router.post('/logout', auth,userController.logout);

//Admin Routes 
router.post('/admin/upload/image', auth, uploadImage.single('file'), adminController.uploadImage);

router.post('/admin/upload/dashboard', auth, adminController.uploadDashboard);
router.get('/admin/fetch/dashboard', auth, adminController.fetchDashboard);
router.delete('/admin/delete/dashboard/:id', auth, adminController.deleteDashboard);

router.post('/admin/upload/product', auth, adminController.uploadProduct);
router.get('/admin/fetch/products', auth, adminController.fetchProducts);
router.put('/admin/update/product/:id', auth, adminController.updateProduct);
router.delete('/admin/delete/product/:id', auth, adminController.deleteProduct);

//Shop Routes
router.get('/shop/fetch/products', auth, shopController.fetchProducts);
router.get('/shop/fetch/address/:id', auth, shopController.fetchAddress);
router.post('/shop/upload/address', auth, shopController.uploadAddress);
router.put('/shop/update/address/:id', auth, shopController.updateAddress);
router.delete('/shop/delete/address/:id', auth, shopController.deleteAddress);

router.get('/home',auth,(req,res)=>{
  const user = req.user;
  res.status(200).json({user});
});

module.exports = router;
