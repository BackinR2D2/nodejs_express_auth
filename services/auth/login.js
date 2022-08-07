import User from '../../db/models/user.js';

async function getUser (username) {
    const encryptedUsername = Buffer.from(username).toString('base64');
    const existingUser = await User.findOne({ username: encryptedUsername });
    return existingUser;
}

const loginServices = {
    getUser,
};

export default loginServices;