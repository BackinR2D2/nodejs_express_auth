import Joi from 'joi';
import sanitize from 'sanitize-html';
import userServices from '../../services/user/index.js';

const usernameSchema = Joi.string().required().max(25);
const passwordSchema = Joi.string().required().min(8).max(25);

async function getUserData (req, res) {
    try {
        const userId = req.user.id;
        const userData = await userServices.getUserById(userId);
        if(!userData) {
            res.status(404).json({
                status: 0,
                message: 'User not found',
            });
            return;
        } else {
            res.status(200).json(userData);
        }
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message ?? 'Internal Server Error',
        })
    }
}

async function updateUsername (req, res) {
    try {
        let { newUsername } = req.body;
        newUsername = sanitize(newUsername);
        const {error} = usernameSchema.validate(newUsername);
        if (error) {
            res.status(400).json({
                status: 0,
                message: error.details[0].message,
            });
            return;
        }
        
        const userId = req.user.id;
        const user = await userServices.updateUsername(userId, newUsername);

        if(user) {
            res.status(201).json({
                status: 1,
                message: 'Username updated successfully',
            });
        }

    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message ?? 'Internal Server Error',
        })
    }
}

async function updatePassword (req, res) {
    try {
        let { newPassword } = req.body;
        newPassword = sanitize(newPassword);
        const {error} = passwordSchema.validate(newPassword);
        if (error) {
            res.status(400).json({
                status: 0,
                message: error.details[0].message,
            });
            return;
        }

        const userId = req.user.id;
        const user = await userServices.updatePassword(userId, newPassword);

        if(user) {
            res.status(201).json({
                status: 1,
                message: 'Password updated successfully',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message ?? 'Internal Server Error',
        });
    }
} 

async function deleteUser (req, res) {
    try {
        const userId = req.user.id;
        const user = await userServices.deleteUser(userId);
        if(user) {
            res.status(200).json({
                status: 1,
                message: 'User deleted successfully',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message ?? 'Internal Server Error',
        });
    }
}

const userController = {
    getUserData,
    updateUsername,
    updatePassword,
    deleteUser,
};

export default userController;