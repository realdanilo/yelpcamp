const express = require("express")
const router = express.Router()

const { userIndex, userUpdate } = require("../controllers/users")
const { isLoggedIn } = require("../middleware/index")

// goes to /:username
router.get("/:username", userIndex)
router.put("/:username", userUpdate)
module.exports = router;