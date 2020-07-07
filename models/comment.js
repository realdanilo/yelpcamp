const mongoose = require("mongoose")

let commentSchema = new mongoose.Schema({
    description: String,
    author: {
        username: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },


})

module.exports = mongoose.model("Comment", commentSchema)