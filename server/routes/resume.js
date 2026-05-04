const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const protect = require('../middleware/authMiddleware');

// Multer setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed!'), false);
    }
  }
});

// Upload + Extract text from PDF
router.post('/upload', protect, upload.single('resume'), async (req, res) => {
  try {
    // Read the uploaded file
    const dataBuffer = fs.readFileSync(req.file.path);

    // Extract text from PDF
    const pdfData = await pdfParse(dataBuffer);

    // Delete temp file after reading
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'PDF uploaded and text extracted successfully!',
      text: pdfData.text
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;