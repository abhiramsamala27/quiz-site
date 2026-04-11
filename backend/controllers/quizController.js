const Question = require('../models/Question');
const Result = require('../models/Result');
const https = require('https');

// Helper to send email via Resend API (Railway-safe)
async function sendResultEmail(name, email, score, total) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: RESEND_API_KEY is missing in environment variables.');
    return;
  }

  const data = JSON.stringify({
    from: 'PrepMock <onboarding@resend.dev>', // Resend's default sender for unverified domains
    to: [email],
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
        <p style="font-size: 0.8rem; color: #999;">This is an automated result email from PrepMock ⚡. Thank you for participating!</p>
      </div>
    `
  });

  const options = {
    hostname: 'api.resend.com',
    port: 443,
    path: '/emails',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => { responseData += chunk; });
    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('✅ Email sent successfully via Resend API');
      } else {
        console.error('❌ Resend API Error:', responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ HTTPS Request Error:', error.message);
  });

  req.write(data);
  req.end();
}

exports.getQuestions = async (req, res) => {
  try {
    const start = Date.now();
    const questions = await Question.find({});
    
    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found in the database.' });
    }

    const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, 10);
    const sanitizedQuestions = shuffled.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.json(sanitizedQuestions);
  } catch (err) {
    console.error('getQuestions Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  const { name, email, answers, timeTaken, questionIds: providedIds, resume } = req.body;
  
  try {
    let score = 0;
    const idsToFetch = providedIds && providedIds.length > 0 ? providedIds : Object.keys(answers);
    const questions = await Question.find({ _id: { $in: idsToFetch } });

    questions.forEach(q => {
      if (answers[q._id.toString()] === q.correctAnswer) {
        score++;
      }
    });

    const totalQuestions = questions.length;
    
    const result = new Result({ 
      name, 
      email, 
      score, 
      totalQuestions, 
      timeTaken: timeTaken || '00:00',
      resume: resume || null
    });
    
    await result.save();
    console.log(`✅ Result saved. Score: ${score}/${totalQuestions}`);

    sendResultEmail(name, email, score, totalQuestions);

    res.json({ score, totalQuestions });
  } catch (err) {
    console.error('submitQuiz Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};
