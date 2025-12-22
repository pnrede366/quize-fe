const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Category = require('../models/Category');
const Result = require('../models/Result');
const User = require('../models/User');
const { generateQuizWithGrok } = require('../services/grokService');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({ error: 'Topic and difficulty are required' });
    }

    const user = req.user;

    // Check if user has reached free tier limit
    const isExpired = user.premiumExpiresAt && new Date() > user.premiumExpiresAt;
    if (!user.isPremium || isExpired) {
      if (user.aiQuizzesGenerated >= 3) {
        return res.status(403).json({ 
          error: 'Free tier limit reached',
          message: 'You have reached your limit of 3 AI-generated quizzes. Upgrade to Premium for unlimited quiz generation!',
          limitReached: true,
        });
      }
    }

    const quizData = await generateQuizWithGrok(topic, difficulty);

    // Use category from Grok or fall back to topic
    const categoryName = quizData.category || quizData.topic || topic;
    
    let category = await Category.findOne({ name: categoryName });
    if (!category) {
      category = await Category.create({
        name: categoryName,
        description: `Quizzes about ${categoryName}`,
        quizCount: 0,
      });
    }

    const quiz = new Quiz({
      title: quizData.title || `${quizData.topic} Quiz - Level ${difficulty}`,
      description: `AI-generated quiz on ${quizData.topic}`,
      difficulty: parseInt(difficulty.split('-')[0]),
      topic: quizData.topic || topic,
      questions: quizData.questions,
      userId: req.user._id,
      categoryId: category._id,
    });

    const savedQuiz = await quiz.save();

    category.quizCount += 1;
    await category.save();

    // Increment AI quiz generation counter for free users
    if (!user.isPremium || isExpired) {
      await User.findByIdAndUpdate(user._id, {
        $inc: { aiQuizzesGenerated: 1 },
      });
    }

    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate quiz' });
  }
});

router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('userId', 'username')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('userId', 'username')
      .populate('categoryId', 'name');
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let score = 0;
    const answerDetails = [];
    const results = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) score++;

      answerDetails.push({
        questionIndex: index,
        selectedAnswer: userAnswer,
        isCorrect,
      });

      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      };
    });

    const percentage = (score / quiz.questions.length) * 100;

    const result = await Result.create({
      userId: req.user._id,
      quizId: quiz._id,
      score,
      totalQuestions: quiz.questions.length,
      percentage: parseFloat(percentage.toFixed(2)),
      answers: answerDetails,
    });

    // Calculate points based on difficulty level
    const difficultyMultiplier = {
      1: 10,   // Easy (0-2): 10 points per correct answer
      2: 10,
      3: 15,   // Medium (3-5): 15 points per correct answer
      4: 15,
      5: 15,
      6: 20,   // Hard (6-8): 20 points per correct answer
      7: 20,
      8: 20,
      9: 25,   // Expert (9-10): 25 points per correct answer
      10: 25,
    };
    
    const pointsPerQuestion = difficultyMultiplier[quiz.difficulty] || 10;
    const earnedPoints = score * pointsPerQuestion;

    const user = await User.findById(req.user._id);
    user.totalQuizzesPlayed += 1;
    user.totalScore += score;
    user.points += earnedPoints;
    
    const newLevel = Math.floor(user.points / 1000) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
    }
    
    await user.save();

    quiz.timesPlayed += 1;
    await quiz.save();

    // Emit socket event for leaderboard update
    const io = req.app.get('io');
    if (io) {
      io.emit('leaderboard-update', {
        userId: req.user._id,
        username: user.username,
        points: user.points,
        level: user.level,
      });
    }

    res.json({
      score,
      total: quiz.questions.length,
      percentage: percentage.toFixed(2),
      results,
      resultId: result._id,
      pointsEarned: earnedPoints,
      pointsPerQuestion: pointsPerQuestion,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (quiz.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to edit this quiz' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (quiz.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to delete this quiz' });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

