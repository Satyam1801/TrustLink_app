// 💎 TrustLink Profile Controller
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🔱 Update Profile
exports.updateProfile = async (req, res) => {
  const { bio, avatarUrl } = req.body;

  try {
    const updatedProfile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: { bio, avatarUrl }
    });

    res.status(200).json({ success: true, profile: updatedProfile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

// 🔱 Get Profile by Username
exports.getProfileByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        profile: {
          include: {
            links: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, profile: user.profile, username: user.username });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
};
