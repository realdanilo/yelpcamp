const User = require("../models/user")
const passport = require("passport")
module.exports = {
    async registerUser(req, res, next) {
        try {
            let newUser = new User({ username: req.body.username })
            let user = await User.register(newUser, req.body.password)
            //set admin if there is key
            if (req.body.adminKey == "admin123") {
                user.admin = true
                user.save()
            }
            passport.authenticate("local")(req, res, () => {
                req.flash("success", `Welcome ${user.username}`)
                return res.redirect("/campgrounds")
            })
        } catch (error) {
            //flash
            req.flash("error", error.message)
            res.redirect("back")
        }

    },
    login(req, res, next) {
        passport.authenticate('local', {
            failureRedirect: '/login',
            successRedirect: "/campgrounds",
            failureFlash: true,
            successFlash: "Welcome back"
        })(req, res, next)
    },
    logout(req, res, next) {
        req.logout();
        //flash 
        req.flash("success", "Logged out")
        return res.redirect('/');
    }
}
