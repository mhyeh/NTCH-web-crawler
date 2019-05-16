const db = require('../node_modules/mongodb')

module.exports = {
    mongo: db.MongoClient.connect(require('../config.json').url)
}