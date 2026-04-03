require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Question = require('../models/Question');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected for seeding');

    // Sample Admin
    await Admin.deleteMany({});
    const admin = new Admin({ email: process.env.ADMIN_EMAIL || 'admin@quizapp.com', password: process.env.ADMIN_PASSWORD || 'password123' });
    await admin.save();
    console.log(`✅ Admin account created: ${admin.email} / ${process.env.ADMIN_PASSWORD || 'password123'}`);

    // 20 Questions
    await Question.deleteMany({});
    const questions = [
      { question: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], correctAnswer: 'Paris' },
      { question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 'Mars' },
      { question: 'Who wrote "To Kill a Mockingbird"?', options: ['Harper Lee', 'Mark Twain', 'J.K. Rowling', 'Ernest Hemingway'], correctAnswer: 'Harper Lee' },
      { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctAnswer: 'Pacific' },
      { question: 'What is the chemical symbol for gold?', options: ['Gd', 'Go', 'Au', 'Ag'], correctAnswer: 'Au' },
      { question: 'Which element has the atomic number 1?', options: ['Helium', 'Oxygen', 'Hydrogen', 'Nitrogen'], correctAnswer: 'Hydrogen' },
      { question: 'Who painted the Mona Lisa?', options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Michelangelo'], correctAnswer: 'Da Vinci' },
      { question: 'What is the smallest prime number?', options: ['0', '1', '2', '3'], correctAnswer: '2' },
      { question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctAnswer: '1945' },
      { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Vacuole'], correctAnswer: 'Mitochondria' },
      { question: 'Who discovery Penicillin?', options: ['Marie Curie', 'Thomas Edison', 'Alexander Fleming', 'Nikola Tesla'], correctAnswer: 'Alexander Fleming' },
      { question: 'What is the capital of Japan?', options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'], correctAnswer: 'Tokyo' },
      { question: 'Which is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correctAnswer: 'Nile' },
      { question: 'How many continents are there?', options: ['5', '6', '7', '8'], correctAnswer: '7' },
      { question: 'What is the speed of light?', options: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', 'None'], correctAnswer: '300,000 km/s' },
      { question: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Platinum'], correctAnswer: 'Diamond' },
      { question: 'Who invented the light bulb?', options: ['Newton', 'Einstein', 'Edison', 'Hawking'], correctAnswer: 'Edison' },
      { question: 'Which language is mainly used for web frontend?', options: ['Python', 'Java', 'JavaScript', 'C++'], correctAnswer: 'JavaScript' },
      { question: 'What is the square root of 64?', options: ['6', '7', '8', '9'], correctAnswer: '8' },
      { question: 'Which animal is known as the King of the Jungle?', options: ['Tiger', 'Elephant', 'Lion', 'Bear'], correctAnswer: 'Lion' },
    ];
    await Question.insertMany(questions);
    console.log('✅ 20 Sample questions inserted');

    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

seedData();
