const User = require("../models/User");

const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            skills,
            bio
        } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password and role are required"
            });
        }

        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            skills,
            bio
        });

        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({
            message: "Failed to create user",
            error: error.message
        });
    }
};

module.exports = {
    createUser
};