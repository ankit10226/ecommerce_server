const cloudinary = require("../config/cloudinary");
const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecommerce_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const uploadImage = multer({storage});
module.exports = uploadImage;