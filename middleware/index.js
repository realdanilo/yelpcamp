const Campground = require("../models/campground")
const Comment = require("../models/comment")
const User = require("../models/user")

module.exports = {

    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash("error", "Please login")
        res.redirect("/login")
    },
    async campOwnership(req, res, next) {
        if (req.isAuthenticated()) {
            // console.log(req.user)
            await Campground.findById(req.params.id, (error, campAuth) => {
                if (campAuth.author.id.equals(req.user._id) || req.user.admin) {
                    return next()
                } else {
                    //flash no owenership of camp
                    req.flash("error", "You are not the owner")
                    res.redirect("back")
                }
            })
        }
        else {
            req.flash("error", "Please login")
            res.redirect("/login")
        }
    },
    async commentOwnership(req, res, next) {
        if (req.isAuthenticated()) {
            let comment = await Comment.findById(req.params.comment_id)
            if (comment.author.id.equals(req.user._id) || req.user.admin) {
                return next()
            } else {
                req.flash("error", "You are not the owner")
                res.redirect("/login")
            }
        }
        else {
            req.flash("error", "Please login")
            res.redirect("/login")
        }
    },
    asyncErrorHandler: fn =>
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                .catch(error => {
                    //flash and redirect(back)
                    req.flash("error", error.message)
                    return res.render("error")
                })
        }
}