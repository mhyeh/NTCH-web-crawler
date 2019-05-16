const querystring = require('querystring');
const request     = require('request')
const cheerio     = require('cheerio')

const locationSet = new Set()
const tagSet      = new Set()

const crawling = () => {
    return new Promise((resolve, reject) => {
        request({ url: 'https://www.artsticket.com.tw/CKSCC2005/Product/Product00/ProductsCategoriesPage.aspx?ProductsCategoryId=8JNfZ4VZd5R%2b6AG8ujzh6g', method: 'GET' }, async (error, res, body) => {
            if (error || !body) {
                // reject('NTCH web was broken') 
                resolve([])
                return
            }
            let $ = cheerio.load(body)

            const totalPage = Number($('#aspnetForm .wrapper .main .mainInner .mainInnerLeft .block01 .pagerUl').text().trim().slice(-3, -1))
            const n = $('#aspnetForm .wrapper .main .mainInner .mainInnerLeft .block01 .pagerUl .circlePage').length - 1

            const show = []
            for (let i = 0; i < totalPage; i++) {
                show.push($)
                const state      = $('#aspnetForm #__VIEWSTATE').val()
                const generator  = $('#aspnetForm #__VIEWSTATEGENERATOR').val()
                const validation = $('#aspnetForm #__EVENTVALIDATION').val()
                let target;
                if (i < n - 1) {
                    target = i + 1
                } else {
                    target = 3
                }
                try {
                    body = await getNextPage(target, state, generator, validation)
                    if (body !== undefined) {
                        $ = cheerio.load(body)
                    }
                } catch (e) {
                    break
                }
            }

            const promise = []
            show.forEach($ => {
                const programContainer = $('#aspnetForm .wrapper .main .mainInner .mainInnerLeft .block01').find('.programContainer')
                for (let i = 0; i < programContainer.length; i++) {
                    const program = programContainer.eq(i).find('.program')
                    for (let j = 0; j < program.length; j++) {
                        const link = program.eq(i).find('a').eq(0).attr('href')
                        promise.push(getInfo(link))
                    }
                }
            })
    
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

const getNextPage = (target, state, generator, validation) => {
    return new Promise((resolve, reject) => {
        const form = {
            __EVENTTARGET: '_ctl0$ContentPlaceHolder1$rptPaging$_ctl' + target + '$btnPage',
            __VIEWSTATE: state,
            __VIEWSTATEGENERATOR: generator,
            __EVENTVALIDATION: validation
        }
        const formData = querystring.stringify(form)
        request({ 
            url: 'https://www.artsticket.com.tw/CKSCC2005/Product/Product00/ProductsCategoriesPage.aspx?ProductsCategoryId=8JNfZ4VZd5R%2b6AG8ujzh6g', 
            method: 'POST', 
            headers: {
                'Content-Length': formData.length,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        }, (error, res, body) => {
            if (error || !body) {
                // reject('NTCH web was broken') 
                resolve(undefined)
                return
            }
            resolve(body)
        })
    })
}

crawling().then(res => {
}).catch(err => {
    console.log(err)
})

const getInfo = (url) => {
    return new Promise((resolve, reject) => {
        url = "https://www.artsticket.com.tw/CKSCC2005/Product/Product00/" +
        url
        request({ url: url, method: 'GET' }, (error, res, body) => {
            if (error || !body) {
                // reject('NTCH web was broken') 
                resolve([])
                return
            }
            const $      = cheerio.load(body)
            const result = []

            const date_tr = $('#aspnetForm .wrapper .main .mainInner .programKv .programTime table tbody tr')
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