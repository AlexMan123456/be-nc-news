const express = require("express")
const { getAllEndpoints } = require("../controllers/endpoints-controller")
const router = express.Router()

router.get("/", getAllEndpoints)

module.exports = router