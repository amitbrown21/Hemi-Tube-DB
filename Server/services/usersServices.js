const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const createUser = async (userData) => {
    userData.password = bcrypt.hashSync(userData.password, 10);
    const user = new User(userData);
    return await user.save();
};

const getUsers = async () => {
    return await User.find();
};

const getUserById = async (id) => {
    return await User.findById(id);
};

const updateUser = async (id, updateData) => {
    if (updateData.password) {
        updateData.password = bcrypt.hashSync(updateData.password, 10);
    }
    return await User.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};