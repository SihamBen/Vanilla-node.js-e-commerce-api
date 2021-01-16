const jwt=require('jsonwebtoken')
export const checkJwt = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers['authorization'];

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    let jwtPayload;

    try {
        jwtPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SIGNATURE_KEY);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        res.status(401).send();
        return;
    }

    const { userId, email } = jwtPayload;
    const newToken = jwt.sign({ userId, email }, process.env.ACCESS_TOKEN_SIGNATURE_KEY, {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken);

    next();
};