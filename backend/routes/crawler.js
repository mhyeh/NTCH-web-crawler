const express = require('express')
const router = express.Router()

const crawlerService = require('../Project/Service/CrawlerService')

router.get('/', (req, res, next) => {
    try {
        crawlerService.crawling()
    } catch (e) {
        console.log(e)
    }
    res.status(200).json({ msg: 'crawling' })
})

module.exports = router
