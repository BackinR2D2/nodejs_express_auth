import Joi from 'joi';
import sanitize from 'sanitize-html';
import registerServices from '../../services/auth/register.js';

const schema = Joi.object({
    username: Joi.string().required().max(25),
    password: Joi.string().required().min(8).max(25),
    createAccountCode: Joi.string().required().max(25),
});

async function register(req, res) {
    try {
        let {username, password, createAccountCode} = req.body;
        username = sanitize(username);
        password = sanitize(password);
        createAccountCode = sanitize(createAccountCode);
        const {error} = schema.validate({username, password, createAccountCode});
        if (error) {
            res.status(400).json({
                status: 0,
                message: error.details[0].message,
            });
            return;
        }
        if(createAccountCode !== process.env.CREATE_ACCOUNT_CODE) {
            res.status(400).json({
                status: 0,
                message: 'Invalid code',
            });
            return;
        }

        const existingUser = await registerServices.getUser(username);

        if(existingUser) {
            res.status(400).json({
                status: 0,
                message: 'User already exists',
            });
        } else {
            const user = await registerServices.createUser(username, password);
            if(user) {
                res.status(201).json({
                    status: 1,
                    message: 'User created',
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

export default register;