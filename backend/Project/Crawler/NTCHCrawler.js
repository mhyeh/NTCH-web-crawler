const request = require('request')
const cheerio = require('cheerio')

const locationSet = new Set()
const tagSet      = new Set()

const crawling = () => {
    return new Promise((resolve, reject) => {
        request({url: 'https://www.artsticket.com.tw/CKSCC2005/Product/Product00/ProductsCategoriesListPage.aspx?ProductsCategoryId=8JNfZ4VZd5R%2b6AG8ujzh6g', method: "GET"}, async (error, res, body) => {
            if (error || !body) {
                // reject('NTCH web was broken') 
                resolve([])
                return
            }
            const $       = cheerio.load(body)
            const promise = []

            const table_tr = $('#aspnetForm #layout #container #right #program #program_list #list table tbody tr')
    
            for (let i = 1; i < table_tr.length; i++) {
                const link = table_tr.eq(i).find('td a').eq(0).attr('href');
                promise.push(getInfo(link))
            }
            try {
                const result   = await Promise.all(promise)
                const tags     = Array.from(tagSet).map(t => ({ tags: t }))
                const location = Array.from(locationSet).map(l => {
                    const t = l.split(',')
                    return { location: t[0], code: Number(t[1]) }
                })
                resolve({ result: result.flat(), location: location, tags: tags })
            } catch (e) {
                reject(e)
            }
        })
    })
}

const getInfo = (url) => {
    return new Promise((resolve, reject) => {
        url = "https://www.artsticket.com.tw/CKSCC2005/Product/Product00/" +
        url
        request({url: url, method: "GET"}, (error, res, body) => {
            if (error || !body) {
                // reject('NTCH web was broken') 
                resolve([])
                return
            }
            const $      = cheerio.load(body)
            const result = []

            const date_tr = $('#aspnetForm #layout #container #right #program-in #p_interduce #place')
            let tag       = $('#aspnetForm #layout #container #right #program-in #p_trail').children().remove('div').end().text().split(/ ＞/);
            const title   = tag[tag.length - 1].trim()

            tag = tag.slice(2, -1).map(t => t.trim())
            if (tag.length === 0) {
                tag.push('其他音樂節目')
            }
            tag.forEach(t => tagSet.add(t))

            for (let i = 0; i < date_tr.length; i++) {
                const date_td  = date_tr.eq(i).find('td')
                const location = date_td.eq(1).text().split(/[(（﹝]/)[0].trim()
                let dateTime   = date_td.eq(0).html().split('<br>')
                dateTime       = dateTime[0].trim() + ' ' + dateTime[1].trim().substr(-5)

                const Taipei    = /(國家音樂廳)|(兩廳院)/
                const Taichung  = /[台臺]中國家歌劇院/
                const Kaohsiung = /衛武營/

                let code;
                if (Taipei.exec(location)) {
                    code = 0
                    locationSet.add('國家音樂廳,0')
                } else if (Taichung.exec(location)) {
                    code = 1
                    locationSet.add('台中歌劇院,1')
                } else if (Kaohsiung.exec(location)) {
                    code = 2
                    locationSet.add('衛武營,2')
                } else {
                    code = 3
                    locationSet.add('其他,3')
                }

                res = {
                    date:     new Date(dateTime),
                    location: location,
                    code:     code,
                    title:    title,
                    tag:      tag,
                    url:      url,
                }
                result.push(res)
            }
            resolve(result)
        })
    })
}

module.exports = {
    crawling: crawling
}