let Comment = require("../models/comment")
let Campground = require("../models/campground")
module.exports = {
    commentNew(req, res, next) {
        let campground = req.params.id
        res.render("comments/new", { campground })
    },
    async commentPost(req, res, next) {
        //sanitze
        req.body.comment.description = req.sanitize(req.body.comment.description)
        let commentNew = {
            description: req.body.comment.description,
            author: { id: req.user._id, username: req.user.username }
        }
        let comment = await Comment.create(commentNew)
        let campground = await Campground.findById(req.params.id)
        campground.comments.push(comment)
        campground.save()
        res.redirect(`/campgrounds/${req.params.id}`)
    },
    async commentEdit(req, res, next) {
        let comment = await Comment.findById(req.params.comment_id)
        let campground = req.params.id
        res.render("comments/edit", { comment, campground })

    },
    async commentPut(req, res, next) {
        //sanitize
        req.body.comment.description = req.sanitize(req.body.comment.description)
        let comment = await Comment.findById(req.params.comment_id)
        comment.description = req.body.comment.description
        comment.save()
        res.redirect(`/campgrounds/${req.params.id}`)
    },
    async commentDelete(req, res, next) {
        await Comment.findByIdAndRemove(req.params.comment_id)
        res.redirect(`/campgrounds/${req.params.id}`)
    }

}