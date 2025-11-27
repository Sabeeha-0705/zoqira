const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const AptitudeQuestion = require('../models/AptitudeQuestion.model');

dotenv.config();

const sampleQuestions = [
  // Quantitative – Percentages & Ratios
  {
    category: 'Quantitative',
    topic: 'Percentages',
    question: 'If 25% of a number is 60, what is the number?',
    options: ['180', '200', '220', '240'],
    correctOptionIndex: 3,
    difficulty: 'easy',
    explanation: '25% is one quarter, so 60 × 4 = 240.'
  },
  {
    category: 'Quantitative',
    topic: 'Ratios',
    question: 'The ratio of boys to girls in a class is 3:2 and there are 30 students. How many girls are there?',
    options: ['10', '12', '18', '20'],
    correctOptionIndex: 1,
    difficulty: 'easy',
    explanation: 'Total parts = 3 + 2 = 5, girls = (2/5) × 30 = 12.'
  },
  {
    category: 'Quantitative',
    topic: 'Percentages',
    question: 'A product priced at ₹500 is offered at a 20% discount. What is the sale price?',
    options: ['₹380', '₹390', '₹400', '₹420'],
    correctOptionIndex: 2,
    difficulty: 'easy',
    explanation: '20% of 500 is 100, so 500 − 100 = 400.'
  },
  {
    category: 'Quantitative',
    topic: 'Ratios',
    question: 'In a mixture of 45 litres, the ratio of milk to water is 7:2. How much milk is there?',
    options: ['5 litres', '25 litres', '35 litres', '40 litres'],
    correctOptionIndex: 2,
    difficulty: 'medium',
    explanation: 'Total parts = 7 + 2 = 9, milk = (7/9) × 45 = 35 litres.'
  },
  {
    category: 'Quantitative',
    topic: 'Percentages',
    question: 'An item’s price rises from ₹150 to ₹180. What is the percentage increase?',
    options: ['15%', '18%', '20%', '25%'],
    correctOptionIndex: 2,
    difficulty: 'medium',
    explanation: 'Increase = 30; 30/150 × 100 = 20%.'
  },
  {
    category: 'Quantitative',
    topic: 'Ratios',
    question: 'Divide ₹840 between A and B in the ratio 4:3. How much does B get?',
    options: ['₹280', '₹320', '₹360', '₹420'],
    correctOptionIndex: 2,
    difficulty: 'easy',
    explanation: 'Total parts = 7, B = (3/7) × 840 = 360.'
  },
  {
    category: 'Quantitative',
    topic: 'Percentages',
    question: 'A student scores 420 marks out of 600. What is the percentage score?',
    options: ['65%', '68%', '70%', '72%'],
    correctOptionIndex: 2,
    difficulty: 'easy',
    explanation: '420/600 × 100 = 70%.'
  },
  {
    category: 'Quantitative',
    topic: 'Ratios',
    question: 'The ages of A and B are in the ratio 5:7 and their sum is 48. What is A\'s age?',
    options: ['16 years', '20 years', '24 years', '28 years'],
    correctOptionIndex: 1,
    difficulty: 'medium',
    explanation: 'Total parts = 5 + 7 = 12, A = (5/12) × 48 = 20 years.'
  },

  // Logical
  {
    category: 'Logical',
    topic: 'Number Series',
    question: 'Find the next number in the series: 2, 6, 18, 54, ?',
    options: ['108', '162', '216', '324'],
    correctOptionIndex: 1,
    difficulty: 'medium',
    explanation: 'Each term is multiplied by 3. So 54 × 3 = 162.'
  },
  {
    category: 'Logical',
    topic: 'Odd One Out',
    question: 'Find the odd one out: 3, 9, 27, 81, 100',
    options: ['3', '9', '27', '100'],
    correctOptionIndex: 3,
    difficulty: 'easy',
    explanation: 'All others are powers of 3; 100 is not.'
  },

  // Verbal
  {
    category: 'Verbal',
    topic: 'Synonyms',
    question: 'Choose the word which is most similar in meaning to "Rapid".',
    options: ['Slow', 'Quick', 'Dull', 'Lazy'],
    correctOptionIndex: 1,
    difficulty: 'easy',
    explanation: '"Rapid" means fast or quick.'
  },
  {
    category: 'Verbal',
    topic: 'Antonyms',
    question: 'Choose the word which is opposite in meaning to "Victory".',
    options: ['Prize', 'Joy', 'Defeat', 'Glory'],
    correctOptionIndex: 2,
    difficulty: 'easy',
    explanation: 'Opposite of victory is defeat.'
  },
  {
    category: 'Verbal',
    topic: 'Grammar',
    question: 'Choose the correct sentence.',
    options: [
      'She don’t like coffee.',
      'She doesn’t likes coffee.',
      'She doesn’t like coffee.',
      'She not like coffee.'
    ],
    correctOptionIndex: 2,
    difficulty: 'medium',
    explanation: 'Correct subject–verb agreement: "She doesn’t like coffee."'
  }
];

const seedData = async () => {
  try {
    await connectDB();

    if (process.argv[2] === '--clear') {
      await AptitudeQuestion.deleteMany({});
      console.log('✅ All aptitude questions cleared');
      process.exit(0);
    }

    await AptitudeQuestion.deleteMany({});
    await AptitudeQuestion.insertMany(sampleQuestions);
    console.log('✅ Aptitude Seed Data Inserted');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedData();
