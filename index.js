// ### IMPORTS, CONSTS n STUFF
// EXPRESS
const express = require('express')
const app = express()
const port = 3003
const bodyParser = require('body-parser');

// FILE SYSTEM
const fs = require('fs')
const puppeteer = require('puppeteer');

// LOCAL FILES
const nikeSnkrs = require("./nikeSnkrs")

app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header("Acess-Conontrol-Allow-Origin", "*");
    res.header("Acess-Control-Allow-Headers", "Content-Type");
    next();
})

app.get('/snkrs', async (req, res) => {
    var data = await scrapeNikeSnkrs()

    res.send(data)
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


async function getSnkrs() {
    // Scrape data
    const newSnkrs = await nikeSnkrs.scrapeNikeSnkrs()
    // Read old snapshot
    const oldSnkrsJson = fs.readFileSync('nikeSnkrsSnap.json')
    const oldSnkrs = JSON.parse(oldSnkrsJson)
    console.log(`${oldSnkrs} ${Object.keys(oldSnkrs).length}`)
    for (var i = 0; i < Object.keys(oldSnkrs).length; i++) {
        console.log(` - Model Name: ${oldSnkrs[i].modelName},
                \n - Name: ${oldSnkrs[i].name},
                \n - Price: ${oldSnkrs[i].price},
                \n - IMG: ${oldSnkrs[i].imgSrc}\n\n`)
    }
    //const snkrJson = JSON.stringify(s)
    //fs.writeFileSync('nikeSnkrsSnap.json', snkrJson)
}

getSnkrs()