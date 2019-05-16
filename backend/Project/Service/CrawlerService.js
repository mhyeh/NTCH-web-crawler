const dataRepo = require('../Repository/DataRepo')
const crawler  = require('../Crawler/NTCHCrawler')

const crawling = async () => {
    try {
        const lastUpdate = new Date(await dataRepo.getLastUpdate())
        const now = new Date()
        if (lastUpdate.getFullYear() * 100 + lastUpdate.getMonth() < now.getFullYear() * 100 + now.getMonth()) {
            const data = await crawler.crawling()
            dataRepo.insert(data)
        }
    } catch (e) {
        throw e
    }
}

module.exports = {
    crawling: crawling
}