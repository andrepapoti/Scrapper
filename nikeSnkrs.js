const puppeteer = require('puppeteer');
const userAgent = require('user-agents');

async function scrapeSnkr(page, url) {
    try {
        await page.goto(url);

        const [el] = await page.$x('//*[@id="detalhes-produto"]/div[1]/div[3]/div/div[2]/div[1]/a/span');
        const auxText = await el.getProperty('textContent');
        const modelName = await auxText.jsonValue();

        const [el2] = await page.$x('//*[@id="detalhes-produto"]/div[1]/div[3]/div/div[2]/div[1]/a/text()');
        const auxText2 = await el2.getProperty('textContent');
        const name = await auxText2.jsonValue();

        const [el3] = await page.$x('//*[@id="detalhes-produto"]/div[1]/div[3]/div/div[2]/div[2]/span/span/span')
        const auxText3 = await el3.getProperty('textContent');
        const price = await auxText3.jsonValue();

        const [el4] = await page.$x('//*[@id="detalhes-produto"]/div[1]/div[1]/div/div[1]/a/img');
        const auxText4 = await el4.getProperty('src');
        const imgSrc = await auxText4.jsonValue();

        return {modelName, name, price, imgSrc}
    } catch (e) {
        console.log(`Retry ${url}`)
        return await scrapeSnkr(page, url)
    }
}

async function getVitrine(page) {
    const vitrineUrl = 'https://www.nike.com.br/Snkrs#estoque'
    await page.setUserAgent(userAgent.toString())
    await page.goto(vitrineUrl);

    const result = await page.evaluate(() => {
        const nodes = []
        document.querySelectorAll('.produto.produto--comprar .produto__hover .btn').forEach((node) => {
            const link = node.getAttribute('href')
            nodes.push(link)
        })
        // For some reason some urls are returned twice so we remove duplicates
        return Array.from(new Set(nodes))
    })

    return result
}

async function scrapeNikeSnkrs() {
    // Start browser
    const chromeOptions = {
        executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless:true, 
        slowMo:10
    }
    const browser = await puppeteer.launch(chromeOptions);
    const page = await browser.newPage();

    // Get all urls from SNKRS tab
    console.log('Calling vitrine')

    const vitrine = await getVitrine(page)
    
    console.log('Finished vitrine')

    const snkrs = []

    var previousTime = new Date().getTime();
    console.log(`# ${previousTime}`)
    const vitrineLen = Object.keys(vitrine).length
    for (var i = 0; i < vitrineLen; i++) {
        previousTime = new Date().getTime();
        console.log(`Scraping: ${vitrine[i]}`)
        const snkr = await scrapeSnkr(page, vitrine[i])
        snkrs.push(snkr)
        var currentTime = new Date().getTime();
        console.log(`Finished in ${currentTime - previousTime}`)
        timestamp = currentTime
    }
    console.log('Finished!');
    browser.close()

    console.log('Sorting snkrs')
    nkrs.sort(compareSnkrs)
    console.log('Finished sorting')

    // for (var i = 0; i < Object.keys(snkrs).length; i++) {
    // console.log(` - Model Name: ${snkrs[i].modelName},
    //         \n - Name: ${snkrs[i].name},
    //         \n - Price: ${snkrs[i].price},
    //         \n - IMG: ${snkrs[i].imgSrc}\n\n`)
    // }
    return snkrs
}

function compareSnkrs(s1, s2) {
    if (s1.modelName < s2.modelName) {
        return -1
    } else if (s1.modelName > s2.modelName) {
        return 1
    } else { // they have the same model name
        if (s1.name < s2.name) {
            return -1
        } else if (s1.name >= s2.name) {
            return 1
        }
    }
}
// EXPORTS
exports.scrapeNikeSnkrs = scrapeNikeSnkrs