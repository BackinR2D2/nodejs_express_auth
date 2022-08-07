import User from '../../db/models/user.js';
import hashPassword from '../../helpers/auth/hashPassword.js';

async function getUser (username) {
    const encryptedUsername = Buffer.from(username).toString('base64');
    const existingUser = await User.findOne({ username: encryptedUsername });
    return existingUser;
}

async function createUser (username, password) {
    const hashedPassword = await hashPassword(password);
    const encryptedUsername = Buffer.from(username).toString('base64');
    await new User({ username: encryptedUsername, password: hashedPassword }).save();
    return true;
};

const registerServices = {
    getUser,
    createUser,
};

export default registerServices;