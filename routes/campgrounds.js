const express = require("express")
const router = express.Router()
const multer = require("multer")
const { storage } = require("../cloudinary")
const upload = multer({ storage })

const { asyncErrorHandler, isLoggedIn, campOwnership } = require("../middleware")
const { campgroundIndex, campgroundNew, campgroundCreate, campgroundShow, campgroundEdit, campgroundUpdate, campgroundDelete, campgroundAct } = require("../controllers/campgrounds")
// campground index 
router.get("/", asyncErrorHandler(campgroundIndex))
router.get("/new", isLoggedIn, campgroundNew)
router.post("/", isLoggedIn, upload.array("images", 4), asyncErrorHandler(campgroundCreate))
router.get("/:id", asyncErrorHandler(campgroundShow))
router.get("/:id/edit", campOwnership, asyncErrorHandler(campgroundEdit))
router.put("/:id", campOwnership, upload.array("images", 4), asyncErrorHandler(campgroundUpdate))
router.delete("/:id", campOwnership, asyncErrorHandler(campgroundDelete))
//Post Like/unlike to camp 
router.post("/:id/act", asyncErrorHandler(campgroundAct))

module.exports = router;