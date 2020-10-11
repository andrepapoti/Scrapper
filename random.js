const { scrapeNikeSnkrs } = require("./nikeSnkrs")
const puppeteer = require('puppeteer');

function manageConcurrency(urls, browserPages, snkrs) {
    while (Object.keys(browserPages).length > 0 && Object.keys(urls).length > 0) {
        const page = browserPages.pop()
        const url = urls.pop()
        console.log(`Processing: ${url} in page ${page}`)
        p(url).then((data) => {
            snkrs.push(data)
            browserPages.push(page)
            manageConcurrency(urls, browserPages, snkrs)
        })   
    }
}

async function mConc(urls, browserPages) {
    const ret = []
    const size = Object.keys(urls).length

    if (size > 0) {
        for (page in browserPages) {
            const url = urls.pop()
            if (url != undefined) {
                console.log(`Processing: ${url}`)
                ret.push(p(url))
            }
        }
        return ret
    }
}

const p = (num) => {
    return new Promise((resolve, reject) =>{
        setTimeout(() => {
            return resolve(num * 10)
        }, 5000)
    })
}

async function scrapetst() {
    const chormeOptions = {
        executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless:false, 
        slowMo:10,
        defaultViewport: null,
        // userDataDir: './cache'
    }
    const browser = await puppeteer.launch(chormeOptions);
    const page = await browser.newPage();

    const vitrine = [
        'https://www.nike.com.br/Snkrs/Produto/ISPA-Drifter-Gator/153-169-211-208351'
        // 'https://www.nike.com.br/Snkrs/Produto/Space-Hippie-04-Feminino/1-16-210-213002',
        // 'https://www.nike.com.br/Snkrs/Produto/Space-Hippie-04-Feminino/1-16-210-248301',
        // 'https://www.nike.com.br/Snkrs/Produto/ISPA-OverReact-FlyKnit/153-169-211-260419'
    ]

    stst(vitrine[0], page)
    

}

async function stst(url, page) {
    await page.goto(url);
    await page.setRequestInterception(true)
    page.on('request', request => {
        console.log(request)
    })
}

async function testee() {
    scrapetst()
}

testee()