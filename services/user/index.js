import User from '../../db/models/user.js';
import hashPassword from '../../helpers/auth/hashPassword.js';

async function getUserById (id) {
    const user = await User.findOne({ _id: id });
    if(!user) {
        return null;
    } else {
        const username = Buffer.from(user.username, 'base64').toString('ascii')
        return {
            id: user._id,
            username,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
        };
    }
};

async function updateUsername (id, newUsername) {
    const encryptedNewUsername = Buffer.from(newUsername).toString('base64');
    await User.updateOne({ _id: id }, { username: encryptedNewUsername });
    return true;
};

async function updatePassword (id, newPassword) {
    const hashedPassword = await hashPassword(newPassword);
    await User.updateOne({ _id: id }, { password: hashedPassword });
    return true;
};

async function deleteUser (id) {
    await User.deleteOne({ _id: id });
    return true;
};

const userServices = {
    getUserById,
    updateUsername,
    updatePassword,
    deleteUser,
};

export default userServices;