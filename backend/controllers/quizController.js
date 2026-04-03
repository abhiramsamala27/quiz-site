const Question = require('../models/Question');
const Result = require('../models/Result');
const nodemailer = require('nodemailer');

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 20 } }]);
    if (questions.length < 20) {
      return res.status(400).json({ message: 'Not enough questions in the database (min 20 required).' });
    }
    // Remove correct answers before sending to client for security
    const sanitizedQuestions = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));
    res.json(sanitizedQuestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  const { name, email, answers, timeTaken } = req.body;
  try {
    let score = 0;
    const questionIds = Object.keys(answers);
    const questions = await Question.find({ _id: { $in: questionIds } });

    questions.forEach(q => {
      if (answers[q._id] === q.correctAnswer) {
        score++;
      }
    });

    const totalQuestions = questions.length;
    const result = new Result({ name, email, score, totalQuestions, timeTaken: timeTaken || '00:00' });
    await result.save();

    // Send Email
    await sendResultEmail(name, email, score, totalQuestions);

    res.json({ score, totalQuestions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

async function sendResultEmail(name, email, score, total) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"QuizApp ⚡" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Quiz Result - QuizApp ⚡',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #6366f1;">Hello ${name},</h2>
        <p>Congratulations on completing the quiz! Here are your results:</p>
        <div style="background: #f4f7ff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="font-size: 3rem; margin: 0; color: #4f46e5;">${score} / ${total}</h1>
          <p style="color: #666;">Total Score</p>
        </div>
        <p>Your performance was ${score / total >= 0.8 ? 'Excellent! 🌟' : score / total >= 0.5 ? 'Good! 👍' : 'Keep practicing! 💪'}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.8rem; color: #999;">This is an automated result email from QuizApp ⚡. Thank you for participating!</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending email:', err.message);
  }
}
