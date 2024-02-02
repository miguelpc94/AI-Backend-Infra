
const multer = require('multer');
const sanitize = require('sanitize-filename');

// File filter for multer
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      file.originalname = sanitize(file.originalname);
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format'), false);
    }
};


// Multer configuration
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});


imageUpload= (req, res, next) => {
    upload.single('image_file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large' });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(500).json({ error: err.message });
      }
      // Everything went fine, proceed to the next middleware.
      next();
    });
};

module.exports = imageUpload;