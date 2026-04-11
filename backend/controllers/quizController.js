const Question = require('../models/Question');
const Result = require('../models/Result');
const https = require('https');

// Helper to send email via Brevo API (Railway-safe + Works without domain)
async function sendResultEmail(name, email, score, total) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: BREVO_API_KEY is missing.');
    return;
  }

  const data = JSON.stringify({
    sender: { name: 'PrepMock', email: 'abhiramsamala27@gmail.com' },
    to: [{ email: email, name: name }],
    subject: `Assessment Performance Report - ${name}`,
    htmlContent: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
        <h2 style="color: #4f46e5; margin-bottom: 24px;">Assessment Performance Report</h2>
        <p>Dear ${name},</p>
        <p>Thank you for completing the mock assessment. Your performance has been evaluated, and the results are detailed below:</p>
        
        <div style="background-color: #f8fafc; padding: 32px; border-radius: 8px; text-align: center; margin: 32px 0; border: 1px solid #f1f5f9;">
          <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Final Score</p>
          <h1 style="font-size: 48px; margin: 8px 0; color: #0f172a;">${score} / ${total}</h1>
          <p style="margin: 0; font-size: 16px; color: #475569; font-weight: 600;">Overall Achievement: ${Math.round((score / total) * 100)}%</p>
        </div>

        <p style="margin-bottom: 8px;"><b>Performance Evaluation:</b></p>
        <p style="margin-top: 0; color: #475569;">
          ${score / total >= 0.8 ? 'Your performance was exceptional, demonstrating a strong command of the assessment criteria.' : 
            score / total >= 0.5 ? 'Your performance was satisfactory, showing a good understanding of the core concepts with room for further refinement.' : 
            'The results indicate a need for further study and practice to strengthen your understanding of the foundational concepts.'}
        </p>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;">
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          This is an automated notification from the PrepMock Assessment System. Please do not reply to this email.
        </p>
      </div>
    `
  });

  const options = {
    hostname: 'api.brevo.com',
    port: 443,
    path: '/v3/smtp/email',
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => { responseData += chunk; });
    res.on('end', () => {
      if (res.statusCode === 201 || res.statusCode === 200) {
        console.log(`✅ Email sent to ${email} successfully via Brevo`);
      } else {
        console.error('❌ Brevo API Error:', responseData);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ HTTPS Error:', err.message);
  });

  req.write(data);
  req.end();
}

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({});
    if (questions.length === 0) return res.status(404).json({ message: 'No questions found.' });

    const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, 10);
    const sanitizedQuestions = shuffled.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.json(sanitizedQuestions);
  } catch (err) {
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
      if (answers[q._id.toString()] === q.correctAnswer) score++;
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
    console.log(`✅ Result saved for ${email}. Score: ${score}/${totalQuestions}`);

    // Send the email
    sendResultEmail(name, email, score, totalQuestions);

    res.json({ score, totalQuestions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
