
const express = require('express')
const router = express.Router()

const controller = require('../controller')

router.get('/', (req, res) => {
    res.send('API')
})

router.post('/hash', controller.urlToHash )
router.post('/url', controller.hashToUrl )

module.exports = router
