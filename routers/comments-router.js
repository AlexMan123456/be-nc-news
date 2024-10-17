const express = require("express")
const { deleteComment, patchCommentVoteCount } = require("../controllers/comments-controller")
const router = express.Router()

router.route("/:comment_id")
.delete(deleteComment)
.patch(patchCommentVoteCount)

module.exports = router