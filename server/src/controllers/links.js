// 🔗 TrustLink Links Controller
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🔱 Add New Link
exports.addLink = async (req, res) => {
  const { title, url, icon, password, expiresAt } = req.body;

  try {
    const profile = await prisma.profile.findUnique({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    const newLink = await prisma.link.create({
      data: {
        title,
        url,
        icon,
        password: password || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        profileId: profile.id
      }
    });

    res.status(201).json({ success: true, link: newLink });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error adding link' });
  }
};

// 🔱 Get User Links
exports.getLinks = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: { links: true }
    });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    
    res.status(200).json({ success: true, links: profile.links, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching links' });
  }
};

// 🔱 Update Link
exports.updateLink = async (req, res) => {
  const { id } = req.params;
  const { title, url, icon, password, expiresAt } = req.body;

  try {
    const updatedLink = await prisma.link.update({
      where: { id },
      data: {
        title,
        url,
        icon,
        password: password || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });
    res.status(200).json({ success: true, link: updatedLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating link' });
  }
};

// 🔱 Delete Link
exports.deleteLink = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.link.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Link deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting link' });
  }
};

// 🔱 Verify Link (Simulation)
exports.verifyLink = async (req, res) => {
  const { id } = req.params;

  try {
    // 💡 Simulated verification logic
    // In a real app, this would check the URL for a verification tag or meta data.
    const link = await prisma.link.update({
      where: { id },
      data: { isVerified: true }
    });

    // 🏆 Reward Trust Score
    await prisma.profile.update({
      where: { id: link.profileId },
      data: { trustScore: { increment: 5 } }
    });

    res.status(200).json({ success: true, message: 'Link verified! Trust score boosted +5', link });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error verifying link' });
  }
};
