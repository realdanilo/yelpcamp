const User = require("../models/user")

module.exports = {
    async userIndex(req, res, next) {
        let user = await User.findOne({ username: new RegExp(`^${req.params.username}$`, `i`) })
        if (user == null) {
            return res.render("error", { error: `There is no ${req.params.username} user.` })
        }
        return res.render("users/index", { user })
    },
    async userUpdate(req, res, next) {
        //re.body.userId is passed from FrontEnd
        let user = await User.findByIdAndUpdate(req.body.userId, req.body.user)
        return res.redirect("back")
    }

}