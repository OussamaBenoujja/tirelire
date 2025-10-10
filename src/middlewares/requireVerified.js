const UserService = require('../services/UserService');

const userService = new UserService();

async function requireVerified(req, res, next){
    const payload = req.user;
    if(!payload || !payload.email){
        return res.status(401).json({ message: 'User is not authenticated' });
    }
    try {
        const user = await userService.getUserByEmail(payload.email);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        if(!user.isVerified){
            return res.status(403).json({ message: 'User must be verified to perform this action' });
        }
        req.authUser = user;
        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports = requireVerified;
