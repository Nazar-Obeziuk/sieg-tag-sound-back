import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, 'secret123', (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        res.sendStatus(200);
        next();
    });
};

export { authenticateToken };