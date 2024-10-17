const express = require("express")
const { getAllTopics, postTopic } = require("../controllers/topics-controller")
const router = express.Router()

router.route("/")
.get(getAllTopics)
.post(postTopic)

module.exports = router

