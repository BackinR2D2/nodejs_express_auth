import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = req.cookies.token;
    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}