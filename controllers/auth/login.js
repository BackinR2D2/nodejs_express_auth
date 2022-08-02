import User from '../../db/models/user.js';
import Joi from 'joi';
import verifyPassword from '../../helpers/auth/verifyPassword.js';
import generateToken from '../../helpers/auth/generateToken.js';

const schema = Joi.object({
    username: Joi.string().required().max(25),
    password: Joi.string().required().min(8).max(25),
});

async function login(req, res) {
  try {
    const {username, password} = req.body;
    const {error} = schema.validate({username, password});
    if (error) {
        res.status(400).json({
            status: 0,
            message: error.details[0].message,
        });
        return;
    }
    const existingUser = await User.findOne({username});
    if(!existingUser) {
        res.status(404).json({
            status: 0,
            message: 'User does not exist',
        });
    } else {
        const isValid = await verifyPassword(password, existingUser.password);
        if(!isValid) {
            res.status(401).json({
                status: 0,
                message: 'Invalid password or username',
            });
        } else {
            const token = generateToken(existingUser._id);
            res.status(200).json({
                status: 1,
                token
            });
        }
    }

  } catch (error) {
    res.status(500).json({
        status: 0,
        message: error.message ?? 'Internal server error',
    });
  }
}

export default login;