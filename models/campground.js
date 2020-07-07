const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate")

let campgroundSchema = new mongoose.Schema({
    title: String,
    description: String,
    images: [
        {
            url: String,
            public_id: String
        }
    ],
    location: String,
    coordinates: Array,
    likes: {
        type: Number,
        default: 0,
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})
campgroundSchema.plugin(mongoosePaginate)

const User = require("./user"),
    Comment = require("./comment")

campgroundSchema.pre("remove", async function () {
    // console.log("clearing camp id from User likedcamps array")
    await User.updateMany({}, { $pull: { likedCamps: { $in: this._id } } }, { multi: true })
    // console.log("deleting comments cascade")
    await Comment.deleteMany({
        _id: { $in: this.comments }
    })
})

module.exports = mongoose.model("Campground", campgroundSchema)