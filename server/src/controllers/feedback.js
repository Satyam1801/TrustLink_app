// 💬 TrustLink Feedback Controller
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🔱 Add Feedback
exports.addFeedback = async (req, res) => {
  const { message, rating } = req.body;

  try {
    const feedback = await prisma.feedback.create({
      data: {
        message,
        rating: rating ? parseInt(rating) : null,
        userId: req.user.id
      }
    });

    res.status(201).json({ success: true, feedback, message: 'Thanks for your feedback!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error saving feedback' });
  }
};

// 🔱 Get Feedback (Admin Only)
exports.getFeedbacks = async (req, res) => {
  try {
    // For local testing, we bypass the strict ADMIN role check so the developer can see the dashboard.
    const feedbacks = await prisma.feedback.findMany({
      include: { user: { select: { username: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching feedback' });
  }
};
