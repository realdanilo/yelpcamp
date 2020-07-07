const mongoose = require("mongoose")
const Campground = require("./models/campground");

//delete all Camps
module.exports = {
    async deleteCamps(req, res, next) {
        await Campground.deleteMany()
        console.log("all camps delete")
    }
}