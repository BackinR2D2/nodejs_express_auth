import Joi from 'joi';
import User from '../../db/models/user.js';
import hashPassword from '../../helpers/auth/hashPassword.js';

const schema = Joi.object({
    username: Joi.string().required().max(25),
    password: Joi.string().required().min(8).max(25),
    confirmPassword: Joi.string().required().min(8).max(25),
});

async function register(req, res) {
    try {
        const {username, password, confirmPassword} = req.body;
        const {error} = schema.validate({username, password, confirmPassword});
        if (error) {
            res.status(400).json({
                status: 0,
                message: error.details[0].message,
            });
            return;
        }
        if (password !== confirmPassword) {
            res.status(400).json({
                status: 0,
                message: 'Passwords do not match',
            });
            return;
        }
        const existingUser = await User.findOne({username});
        if(existingUser) {
            res.status(400).json({
                status: 0,
                message: 'User already exists',
            });
        } else {
            const hashedPassword = await hashPassword(password);
            await new User({username, password: hashedPassword}).save();
            res.status(201).json({
                status: 1,
                message: 'User created',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message ?? 'Internal server error',
        });
    }
}

export default register;