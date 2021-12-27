const express = require("express")
const router = express.Router()
const { registerUser, login, logout } = require("../controllers")

// landing
router.get("/", (req, res, next) => res.redirect("/campgrounds"))
// register  
router.get("/register", (req, res, next) => res.render("register"))
router.post("/register", registerUser)
// login  
router.get("/login", (req, res, next) => res.render("login"))
router.post("/login", login)
// logout 
router.get("/logout", logout)
// Info
router.get("/info", (req, res, next) => res.render("info"))


module.exports = router;