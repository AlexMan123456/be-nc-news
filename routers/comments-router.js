const express = require("express")
const { deleteComment } = require("../controllers/comments-controller")
const router = express.Router()

router.delete("/:comment_id", deleteComment)

module.exports = router