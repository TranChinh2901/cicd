const JWT = require("jsonwebtoken");

const requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if(!token ) {
           return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
             const decode = JWT.verify(token, process.env.JWT_SECRET);
             req.user = decode; 
                next();
    } catch (error) {
         return res.status(401).json({
            message: 'Unauthorized: Invalid token',
            error: error.message
        });
    }
}