const express = require("express")
const { getAllUsers, getUserByUsername } = require("../controllers/users-controller")
const router = express.Router()

router.get("/", getAllUsers)
router.get("/:username", getUserByUsername)

module.exports = router