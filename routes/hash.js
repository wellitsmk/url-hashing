
const express = require('express')
const router = express.Router()

const controller = require('../controller')

router.get('/:hash', controller.redirect )

module.exports = router
