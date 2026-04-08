const Question = require('../models/Question');
const Admin = require('../models/Admin');
const Result = require('../models/Result');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    console.log('Login attempt for:', email);
    if (!admin) {
      console.log('Admin not found in database');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await admin.comparePassword(password);
    console.log('Password match status:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuestions = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const total = await Question.countDocuments();
    const questions = await Question.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.json({ total, questions, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const count = await Question.countDocuments();
    if (count <= 1) {
      return res.status(400).json({ message: 'Cannot delete the last question. At least 1 question is required for the system.' });
    }
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResults = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  // search by name or email
  const search = req.query.search || '';
  
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const total = await Result.countDocuments(query);
    const results = await Result.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const allStats = await Result.aggregate([
      {
        $facet: {
          metrics: [
            {
              $group: {
                _id: null,
                totalAttempts: { $sum: 1 },
                highestScore: { $max: "$score" }
              }
            }
          ],
          candidates: [
            { $group: { _id: "$email" } },
            { $count: "count" }
          ],
          qualified: [
            {
              $group: {
                _id: "$email",
                bestScore: { $max: "$score" },
                totalQ: { $first: "$totalQuestions" }
              }
            },
            {
              $match: {
                $expr: {
                  $gte: [{ $divide: ["$bestScore", "$totalQ"] }, 0.7]
                }
              }
            },
            { $count: "count" }
          ]
        }
      }
    ]);

    const stats = {
      totalAttempts: allStats[0].metrics[0]?.totalAttempts || 0,
      totalCandidates: allStats[0].candidates[0]?.count || 0,
      qualifiedCandidates: allStats[0].qualified[0]?.count || 0,
      highestScore: allStats[0].metrics[0]?.highestScore || 0
    };

    res.json({ total, results, page, pages: Math.ceil(total / limit), stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.importQuestionsBulk = async (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of questions.' });
    }
    await Question.insertMany(questions);
    res.status(201).json({ message: `${questions.length} questions imported successfully!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResultsAll = async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAllResults = async (req, res) => {
  try {
    await Result.deleteMany({});
    res.json({ message: 'All candidate records have been successfully cleared.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.exportResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    if (results.length === 0) {
      return res.status(404).json({ message: 'No results to export!' });
    }

    // Convert results to CSV format
    const headers = ['Name', 'Email', 'Score', 'Total Questions', 'Time Taken', 'Completion Date'];
    const csvRows = [headers.join(',')];

    results.forEach(r => {
      const row = [
        `"${r.name.replace(/"/g, '""')}"`,
        `"${r.email.replace(/"/g, '""')}"`,
        r.score,
        r.totalQuestions,
        `"${r.timeTaken}"`,
        `"${new Date(r.createdAt).toLocaleString()}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=quiz_results_${Date.now()}.csv`);
    res.status(200).send(csvContent);

  } catch (err) {
    res.status(500).json({ message: 'Export failed: ' + err.message });
  }
};

exports.deleteAllQuestions = async (req, res) => {
  try {
    await Question.deleteMany({});
    res.json({ message: 'All questions have been cleared from the bank.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
