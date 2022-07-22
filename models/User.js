const mongoose = require("mongoose")

const userChema = new mongoose.Schema({
    email: String,
    password: String,
})

module.exports = mongoose.model('User', userChema)