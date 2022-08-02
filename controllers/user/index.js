import User from '../../db/models/user.js';
import Joi from 'joi';
import hashPassword from '../../helpers/auth/hashPassword.js';

const usernameSchema = Joi.string().required().max(25);
const passwordSchema = Joi.string().required().min(8).max(25);

async function getUserData (req, res) {
    try {
        const userId = req.user.id;
        const userData = await User.findOne({ _id: userId });
        if(!userData) {
            res.status(404).json({
                status: 0,
                message: 'User not found',
            });
            return;
        }
        const created_at = new Date(userData.createdAt).toLocaleString();
        const updated_at = new Date(userData.updatedAt).toLocaleString();
        res.status(200).json({
            status: 1,
            data: {
                id: userData._id,
                username: userData.username,
                created_at,
                updated_at,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message ?? 'Internal Server Error',
        })
    }
}

async function updateUsername (req, res) {
    try {
        const { newUsername } = req.body;
        const {error} = usernameSchema.validate(newUsername);
        if (error) {
            res.status(400).json({
                status: 0,
                message: error.details[0].message,
            });
            return;
        }
        const userId = req.user.id;
        await User.replaceOne({_id: userId}, {username: newUsername});
        res.status(201).json({
            status: 1,
            message: 'Username updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: error.message ?? 'Internal Server Error',
        })
    }
}

async function updatePassword (req, res) {
    try {
        const { newPassword } = req.body;
        const {error} = passwordSchema.validate(newPassword);
        if (error) {
            res.status(400).json({
                status: 0,
                message: error.details[0].message,
            });
            return;
        }
        const userId = req.user.id;
        const newHashedPassword = await hashPassword(newPassword);
        await User.replaceOne({_id: userId}, {password: newHashedPassword});
        res.status(201).json({
            status: 1,
            message: 'Password updated successfully',
        });
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
        await User.deleteOne({_id: userId});
        res.status(201).json({
            status: 1,
            message: 'User deleted successfully',
        });
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