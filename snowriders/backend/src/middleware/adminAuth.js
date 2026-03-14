const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Bu işlem için admin yetkisi gerekiyor' });
  }
  next();
};

module.exports = { adminOnly };
