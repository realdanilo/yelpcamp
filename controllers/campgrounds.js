const Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    User = require("../models/user"),
    rp = require('request-promise');
const { cloudinary } = require("../cloudinary")

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
// Doesnt work, "req is not defined" error
// async function findCamp(searchQuery = {}) {
//     let result = await Campground.paginate(searchQuery, {
//         page: req.query.page || 1,
//         limit: 9,
//         sort: { "_id": -1 }
//     })
//     return result
// }

module.exports = {
    async campgroundIndex(req, res, next) {
        if (req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            let campgrounds = await Campground.paginate({ title: regex }, {
                page: req.query.page || 1,
                limit: 9,
                sort: { "_id": -1 }

            })
            campgrounds.page = Number(campgrounds.page)
            return res.render("campgrounds/index", { campgrounds })
        } else {
            let campgrounds = await Campground.paginate({}, {
                page: req.query.page || 1,
                limit: 9,
                sort: { "_id": -1 }
            })
            campgrounds.page = Number(campgrounds.page)
            res.render("campgrounds/index", { campgrounds })
        }
    },
    campgroundNew(req, res, next) {
        return res.render("campgrounds/new")
    },
    async campgroundCreate(req, res, next) {
        req.body.campground.images = []
        //Sanitize
        req.body.campground.title = req.sanitize(req.body.campground.title)
        req.body.campground.description = req.sanitize(req.body.campground.description)
        req.body.campground.location = req.sanitize(req.body.campground.location)
        //upload images
        for (let file of req.files) {
            req.body.campground.images.push({ url: file.secure_url, public_id: file.public_id })
        }
        //forward geolocation
        let response = await rp(`https://api.mapbox.com/geocoding/v5/mapbox.places/${req.body.campground.location}.json?access_token=${process.env.MAPBOX_TOKEN}`)
        let result = await JSON.parse(response)
        req.body.campground.coordinates = result.features[0].center;
        req.body.campground.location = result.features[0].place_name;
        //author
        let author = {
            id: req.user._id,
            username: req.user.username
        }
        req.body.campground.author = author
        let campground = await Campground.create(req.body.campground)
        let user = await User.findById(req.user._id)
        user.campgrounds.push(campground._id)
        user.save()
        return res.redirect(`/campgrounds/${campground._id}`)

    },
    async campgroundShow(req, res, next) {
        let campground = await Campground.findById(req.params.id).populate({
            path: "comments",
            options: { sort: { "_id": -1 } },

        }).exec()
        let MAP_TOKEN = process.env.MAPBOX_TOKEN;
        return res.render("campgrounds/show", { campground, MAP_TOKEN })
    },
    async campgroundEdit(req, res, next) {
        let campground = await Campground.findById(req.params.id)
        return res.render("campgrounds/edit", { campground })
    },
    async campgroundUpdate(req, res, next) {
        let campground = await Campground.findById(req.params.id)
        //Sanitize
        req.body.campground.title = req.sanitize(req.body.campground.title)
        req.body.campground.description = req.sanitize(req.body.campground.description)
        req.body.campground.location = req.sanitize(req.body.campground.location)

        //if deleteImages are checked
        if (req.body.deleteImages && req.body.deleteImages.length) {
            let deleteImages = req.body.deleteImages
            for (let public_id of deleteImages) {
                //delete image(s) from cloud
                await cloudinary.v2.uploader.destroy(public_id)

                //delete image(s) reference from Campgrounds
                for (let image of campground.images) {
                    if (image.public_id == public_id) {
                        let index = campground.images.indexOf(image)
                        campground.images.splice(index, 1)
                    }
                }
            }
        }
        //if new images, Upload
        if (req.files) {
            for (let file of req.files) {
                campground.images.push({ url: file.secure_url, public_id: file.public_id })
            }
        }
        if (req.body.campground.location != campground.location) {
            let response = await rp(`https://api.mapbox.com/geocoding/v5/mapbox.places/${req.body.campground.location}.json?access_token=${process.env.MAPBOX_TOKEN}`)
            let result = await JSON.parse(response)

            campground.coordinates = result.features[0].center;
            campground.location = result.features[0].place_name;
        }
        //update any other text
        campground.title = req.body.campground.title
        campground.description = req.body.campground.description
        campground.save()
        return res.redirect(`/campgrounds/${campground._id}`)
    },
    async campgroundDelete(req, res, next) {
        //delete Images from cloud
        let campground = await Campground.findById(req.params.id)
        for (let image of campground.images) {
            await cloudinary.v2.uploader.destroy(image.public_id)
        }
        //cascade delete comments
        // await Comment.deleteMany({
        //     _id: { $in: campground.comments }
        // })
        //delete camp in User
        let user = await User.findById(req.user._id)
        user.campgrounds.splice(user.campgrounds.indexOf(campground._id), 1)
        user.save()
        // destroy campground
        await campground.remove()
        return res.redirect("/campgrounds")
    },
    async campgroundAct(req, res, next) {
        let user = await User.findById(req.body.user._id)
        let action = req.body.action;
        let counter = action === "Like" ? 1 : -1;

        if (counter == 1) {
            await Campground.updateOne({ _id: req.params.id }, { $inc: { likes: counter } })
            user.likedCamps.push(req.params.id)
            user.save()

        } else {
            await Campground.updateOne({ _id: req.params.id }, { $inc: { likes: counter } })
            user.likedCamps.splice(user.likedCamps.indexOf(req.params.id), 1)
            user.save()
        }
        return res.redirect(`/campgrounds/${req.params.id}`)
    }
}
