import Joi from 'joi';
import verifyPassword from '../../helpers/auth/verifyPassword.js';
import generateToken from '../../helpers/auth/generateToken.js';
import sanitize from 'sanitize-html';
import loginServices from '../../services/auth/login.js';

const schema = Joi.object({
    username: Joi.string().required().max(25),
    password: Joi.string().required().min(8).max(25),
});

async function login(req, res) {
  try {
    let {username, password} = req.body;
    username = sanitize(username);
    password = sanitize(password);
    const {error} = schema.validate({username, password});
    if (error) {
        res.status(400).json({
            status: 0,
            message: error.details[0].message,
        });
        return;
    }
   
    const user = await loginServices.getUser(username);

    if(!user) {
        res.status(404).json({
            status: 0,
            message: 'User does not exist',
        });
    } else {
        const isValid = await verifyPassword(password, user.password);
        if(!isValid) {
            res.status(400).json({
                status: 0,
                message: 'Invalid password or username',
            });
        } else {
            const token = generateToken(user._id);
            res.cookie('token', token, {httpOnly: true}).json({ status: 1 });
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