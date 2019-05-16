const generateConstrain = (data) => {
    const arr = []
    arr.push({ year: data.year })
    arr.push({ month: data.month })
    if (data.day !== undefined) {
        arr.push({ day: data.day })
    }
    if (data.startTime !== undefined || data.endTime !== undefined) {
        const time = {}
        if (data.startTime) {
            time.$gte = data.startTime
        }
        if (data.endTime) {
            time.$lte = data.endTime
        }
        arr.push({ hour: time })
    }
    if (data.location !== undefined && (data.allLocation === undefined || !data.allLocation)) {
        arr.push({ code: { $in: data.location } })
    }
    if (data.tags !== undefined && (data.allTag === undefined || !data.allTag)) {
        const orArr = []
        for (tag of data.tags) {
            orArr.push({ tag: tag })
        }
        arr.push({ $or: orArr })
    }
    return { $and: arr }
}

module.exports = {
    generateConstrain: generateConstrain
}