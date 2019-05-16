const express      = require('express')
const cookieParser = require('cookie-parser')
const cors         = require('cors')

const crawlerRouter = require('./routes/crawler')
const dataRouter    = require('./routes/data')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

app.use('/crawler', crawlerRouter)
app.use('/data',    dataRouter)

module.exports = app
