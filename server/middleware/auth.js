const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required', success: false, error: true });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        req.user = decoded; // Attach decoded user info to request
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token', success: false, error: true });
    }
};


module.exports = auth;
