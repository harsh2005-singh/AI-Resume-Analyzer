const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const protect = require('../middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Analysis = require('../models/Analysis');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// Analyze resume against job description
router.post('/analyze', protect, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const prompt = `
      You are an ATS (Applicant Tracking System) expert.
      Analyze this resume against the job description and return ONLY a JSON object with no extra text.

      Resume: ${resumeText}
      Job Description: ${jobDescription}

      Return this exact JSON structure:
      {
        "overallScore": <number 0-100>,
        "atsSections": {
          "skills": {
            "score": <number 0-100>,
            "missing": [<missing skill strings>],
            "suggestions": [<suggestion strings>]
          },
          "experience": {
            "score": <number 0-100>,
            "missing": [<missing experience strings>],
            "suggestions": [<suggestion strings>]
          },
          "education": {
            "score": <number 0-100>,
            "missing": [<missing education strings>],
            "suggestions": [<suggestion strings>]
          },
          "keywords": {
            "score": <number 0-100>,
            "missing": [<missing keyword strings>],
            "suggestions": [<suggestion strings>]
          },
          "formatting": {
            "score": <number 0-100>,
            "suggestions": [<suggestion strings>]
          }
        },
        "topSuggestions": [<top 5 improvement suggestion strings>]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Clean response and parse JSON
    const cleaned = response.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(cleaned);

    // Save to MongoDB
    const savedAnalysis = await Analysis.create({
      userId: req.userId,
      resumeText,
      jobDescription,
      overallScore: analysis.overallScore,
      atsSections: analysis.atsSections,
      topSuggestions: analysis.topSuggestions
    });

    res.json({
      message: 'Analysis complete!',
      analysisId: savedAnalysis._id,
      ...analysis
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get analysis history
router.get('/history', protect, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('-resumeText');

    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single analysis by ID
router.get('/analysis/:id', protect, async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;