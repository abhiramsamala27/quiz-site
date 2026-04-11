const Question = require('../models/Question');
const Result = require('../models/Result');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  family: 4 // Force IPv4
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Mail Transporter Error:', error.message);
  } else {
    console.log('✅ Mail Transporter is ready to send emails');
  }
});

exports.getQuestions = async (req, res) => {
  try {
    const start = Date.now();
    // Fetch all questions once (faster than random sampling for small banks)
    const questions = await Question.find({});
    
    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found in the database.' });
    }

    // Shuffle in memory and pick 10
    const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, 10);

    // Remove correct answers
    const sanitizedQuestions = shuffled.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    // Add Caching Header to make it feel instant on refresh
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    
    console.log(`Backend: Questions fetched and shuffled in ${Date.now() - start}ms`);
    res.json(sanitizedQuestions);
  } catch (err) {
    console.error('getQuestions Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  const { name, email, answers, timeTaken, questionIds: providedIds, resume } = req.body;
  console.log(`Backend: Submission received from ${email} (${name})`);
  
  try {
    let score = 0;
    const idsToFetch = providedIds && providedIds.length > 0 ? providedIds : Object.keys(answers);
    const questions = await Question.find({ _id: { $in: idsToFetch } });

    console.log(`Backend: Found ${questions.length} questions for grading`);

    questions.forEach(q => {
      if (answers[q._id.toString()] === q.correctAnswer) {
        score++;
      }
    });

    const totalQuestions = questions.length;
    
    if (totalQuestions === 0) {
      console.warn('Backend Warning: totalQuestions is 0. Check questionIds or Database.');
    }

    const result = new Result({ 
      name, 
      email, 
      score, 
      totalQuestions, 
      timeTaken: timeTaken || '00:00',
      resume: resume || null
    });
    
    await result.save();
    console.log(`✅ Backend: Result saved for ${email}. Score: ${score}/${totalQuestions}`);

    // Send Email (Background to prevent lag)
    sendResultEmail(name, email, score, totalQuestions).catch(err => {
      console.error('Mail sending failed:', err.message);
    });

    // Respond to user
    res.json({ score, totalQuestions });
  } catch (err) {
    console.error('submitQuiz Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

async function sendResultEmail(name, email, score, total) {
  const mailOptions = {
    from: `"PrepMock ⚡" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Mock Assessment Performance - PrepMock ⚡',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #6366f1;">Hello ${name},</h2>
        <p>Congratulations on completing your mock assessment! Here is your performance breakdown:</p>
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
