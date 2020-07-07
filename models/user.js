const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

let userSchema = new mongoose.Schema({
    username: String,
    email: String,
    name: String,
    avatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    intro: String,
    birthday: {
        type: Date,
        default: Date.now
    },
    campgrounds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campground"
    }],
    admin: {
        type: Boolean,
        default: false
    },
    likedCamps: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campground"
    }]
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema)