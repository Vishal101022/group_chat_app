const chat = require("../models/chatModel");

// create message
exports.createChat = async (req, res) => { 
    const userId = req.user;
    const { message } = req.body;
    try {
        await chat.create({ message, userId });
        res.status(201).json({ message: "Message sent successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// get message
exports.getChat = async (req, res) => { 
    const userId = req.user;
    try {
        const messages = await chat.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]]
        });
        res.status(200).json({ messages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}