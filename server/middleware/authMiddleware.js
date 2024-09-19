const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.', success: false, error: true });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        req.user = decoded; // Attach user information to the request object
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token.', success: false, error: true });
    }
};

module.exports = authMiddleware;
