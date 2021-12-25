require('dotenv').config()
require('./redis')

const express = require('express')
const bodyParser = require('body-parser')
const apiRoutes = require('./routes')
const hashRoute = require('./routes/hash')

const app = express()

const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 8080

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Serve static files from public folder
app.use(express.static(__dirname + '/public/'))

// API Routes
app.use('/api', apiRoutes)

// For hashed urls
app.use('/', hashRoute)

// 404 Page
app.use('*', (req, res) => {
    res.sendFile(__dirname + '/public/404.html')
})

// Start express server
app.listen(PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', `Server started on: http://${HOST}:${PORT}/`);
})
