const model = require('../Connection').mongo

const getLastUpdate = async () => {
    try {
        const db  = await model
        const res = await db.db().collection('lastUpdate').find().toArray()
        if (res.length === 0) {
            return 0
        }
        return res[0].date
    } catch (e) {
        throw e
    }
}

const getData = async (constrain) => {
    try {
        const db  = await model
        const res = await db.db().collection('data').aggregate([
            {
                $project: {
                    location: 1,
                    code: 1,
                    title: 1,
                    tag: 1,
                    url: 1,
                    date: 1,
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                    day: { $dayOfMonth: '$date' },
                    hour: { $hour: { date: '$date', timezone: '+0800' } },
                }
            },
            {
                $match: constrain
            }
        ]).toArray()
        return res
    } catch (e) {
        throw e
    }
}

const getLocation = async () => {
    try {
        const db  = await model
        const res = await db.db().collection('location').find().toArray()
        return res
    } catch (e) {
        throw e
    }
}

const getTags = async () => {
    try {
        const db  = await model
        const res = await db.db().collection('tags').find().toArray()
        return res
    } catch (e) {
        throw e
    }
}

const insert = async (data) => {
    try {
        const db = await model
        await db.db().collection('data').deleteMany()
        await db.db().collection('location').deleteMany()
        await db.db().collection('tags').deleteMany()
        await db.db().collection('lastUpdate').deleteMany()
        db.db().collection('data').insertMany(data.result)
        db.db().collection('location').insertMany(data.location)
        db.db().collection('tags').insertMany(data.tags)
        db.db().collection('lastUpdate').insertOne({ date: new Date() })
    } catch (e) {
        throw e
    }
}


module.exports = {
    getLastUpdate:  getLastUpdate,
    getData:        getData,
    getLocation:    getLocation,
    getTags:        getTags,
    insert:         insert,
}