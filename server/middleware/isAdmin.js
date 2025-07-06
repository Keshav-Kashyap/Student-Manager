// middleware/isAdmin.js
const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      return next(); // User is admin, allow access
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admins only.'
      });
    }
  } catch (error) {
    console.error('isAdmin middleware error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while checking admin access.'
    });
  }
};

module.exports = isAdmin;
