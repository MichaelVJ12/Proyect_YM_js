const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'img', 'img_dashboard'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `perfil-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

module.exports = upload;
