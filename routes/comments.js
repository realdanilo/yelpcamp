const express = require("express")
const router = express.Router({ mergeParams: true })
const { asyncErrorHandler, isLoggedIn, commentOwnership } = require("../middleware")
const { commentNew, commentPost, commentEdit, commentPut, commentDelete } = require("../controllers/comments")

// working with >>> /campgrounds/:id/comments 

// No show 
router.get("/new", isLoggedIn, asyncErrorHandler(commentNew))
router.post("/", isLoggedIn, asyncErrorHandler(commentPost))
router.get("/:comment_id/edit", commentOwnership, asyncErrorHandler(commentEdit))
router.put("/:comment_id", commentOwnership, asyncErrorHandler(commentPut))
router.delete("/:comment_id", commentOwnership, asyncErrorHandler(commentDelete))
module.exports = router;