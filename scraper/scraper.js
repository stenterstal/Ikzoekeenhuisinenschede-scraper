const puppeteer = require('puppeteer');
const Util = require('./util');

class Scraper {

    /**
     * Scrape www.ikzoekeenhuisinenschede.nl for appartements in price range
     * @param {number} low minimum price of appartment
     * @param {number} high maximum price of appartment
     * @returns {Promise<[]>} List of links with appartments in price range
     */
    async scrapeMain(low, high){
        const browser = await puppeteer.launch({executablePath: process.env.EXECUTABLEPATH});
        const page = await browser.newPage();

        await page.setDefaultNavigationTimeout(0);

        console.log("Scraping https://www.ikzoekeenhuisinenschede.nl/woningaanbod/");

        await page.goto('https://www.ikzoekeenhuisinenschede.nl/woningaanbod/?_filter_prijs=tot73714&_sort=price_desc');

        const advertisements = await page.$$('.huis');

        const links = [];

        for (let i = 0; i < advertisements.length; i++) {
            const price = await advertisements[i].$('.price');
            const priceText =  await (await price.getProperty('innerText')).jsonValue();
            const priceFloat = parseFloat(priceText.replace(',', '.'));
            if(priceFloat > low && priceFloat < high){
                const href = await (await advertisements[i].getProperty('href')).jsonValue();
                links.push(href);
            }
        }
        await browser.close();

        console.log("\nFound " + links.length + " potential appartements\n");

        return links;
    }

    async scrapeDomijn(link){
        const browser = await puppeteer.launch({executablePath: process.env.EXECUTABLEPATH});
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        const appartement = {};
        appartement.href = link;

        console.log("Scraping Domijn: " + link);

        await page.goto(link);

        // Get adress
        const [adress] = await page.$x('//*[@id="content-anchor"]/div[1]/h1');
        const adressText = await adress.getProperty('innerText');
        appartement.adress = await adressText.jsonValue();

        // Get price
        const [price] = await page.$x('//*[@id="content-anchor"]/div[1]/div/div[2]/div[1]/div/div/div[1]/p[1]/span');
        const priceText = await price.getProperty('innerText');
        const priceJson = await priceText.jsonValue();
        appartement.price = Util.trimPrice(priceJson);

        // Get net price
        const [net_price] = await page.$x('//*[@id="content-anchor"]/div[1]/div/div[2]/div[1]/div/div/div[1]/p[3]');
        const net_priceText = await net_price.getProperty('innerText');
        const net_priceJson = await net_priceText.jsonValue();
        appartement.price_net = Util.trimPrice(net_priceJson);

        // Get allowance price
        const [allowance_price] = await page.$x('//*[@id="content-anchor"]/div[1]/div/div[2]/div[1]/div/div/div[1]/p[2]');
        const allowance_priceText = await allowance_price.getProperty('innerText');
        const allowance_priceJson = await allowance_priceText.jsonValue();
        appartement.price_allowance = Util.trimPrice(allowance_priceJson);

        // Get drawing date
        const [drawing] = await page.$x('//*[@id="content-anchor"]/div[1]/div/div[2]/div[1]/div/div/div[2]/dl/dd[3]');
        const drawingText = await drawing.getProperty('innerText');
        const drawingJson = await drawingText.jsonValue();
        appartement.drawingdate = Util.convertDomijnDateTime(drawingJson);

        // Get appartment image href
        const [imagehref] = await page.$x('//*[@id="content-anchor"]/div[1]/div/div[1]/a[1]/img');
        const src = await imagehref.getProperty('src');
        appartement.img_href = await src.jsonValue();

        await browser.close();

        return appartement;
    }

    async scrapeWoonplaats(link){
        const browser = await puppeteer.launch({executablePath: process.env.EXECUTABLEPATH});
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        const appartement = {};
        appartement.href = link;

        console.log("Scraping Woonplaats: " + link);

        await page.goto(link);

        // Get adress
        const [adress] = await page.$x('//*[@id="woningdetails_header"]/h1');
        const adressText = await adress.getProperty('innerText');
        const adressJson = await adressText.jsonValue();
        appartement.adress = Util.trimWoonplaatsAdress(adressJson);

        // Get price
        const [price] = await page.$x('//*[@id="tab-overzicht"]/div[1]/div[1]/div/div[2]/div[1]/div[1]/span[1]');
        const priceText = await price.getProperty('innerText');
        const priceJson = await priceText.jsonValue();
        appartement.price = Util.trimPrice(priceJson);

        // Get net price
        const [net_price] = await page.$x('//*[@id="tab-overzicht"]/div[1]/div[1]/div/div[2]/div[1]/div[2]');
        const net_priceText = await net_price.getProperty('innerText');
        const net_priceJson = await net_priceText.jsonValue();
        appartement.price_net = Util.trimPrice(net_priceJson);

        // Get drawing date
        const [drawing] = await page.$x('//*[@id="tab-overzicht"]/div[1]/div[1]/div/div[2]/span');
        const drawingText = await drawing.getProperty('innerText');
        const drawingJson = await drawingText.jsonValue();
        appartement.drawingdate = Util.convertWoonplaatsDateTime(drawingJson);

        // Get appartment image href
        const [imagehref] = await page.$x('//*[@id="tab-overzicht"]/div[1]/div[1]/div/div[1]/div/a/img');
        const src = await imagehref.getProperty('src');
        appartement.img_href = await src.jsonValue();

        // Click on kenmerken tab
        const [kenmerken] = await page.$x('//*[@id="tabs-algemeen"]/a[2]');
        await kenmerken.click();

        // Get allowance price
        const [allowance_price] = await page.$x('//*[@id="woonvinder_featureblock"]/div[3]/span[2]');
        const allowance_priceText = await allowance_price.getProperty('innerText');
        const allowance_priceJson = await allowance_priceText.jsonValue();
        appartement.price_allowance = Util.trimPrice(allowance_priceJson);

        await browser.close();

        return appartement;
    }

    async scrapeOnshuis(link){

        //
        // TODO: If apparment has heating costs the scraper takes the wrong prices for some categories
        //

        const browser = await puppeteer.launch({executablePath: process.env.EXECUTABLEPATH});
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        const appartement = {};
        appartement.href = link;

        console.log("Scraping Onshuis: " + link);

        await page.goto(link);

        // Get adress
        const [adress] = await page.$x('//*[@id="mainBody"]/div[1]/div/div/div/div[1]/div[1]/div[1]/h2');
        const adressText = await adress.getProperty('innerText');
        appartement.adress = await adressText.jsonValue();

        // Get price
        const [price] = await page.$x('//*[@id="financieel-page"]/div[3]');
        const priceText = await price.getProperty('innerText');
        const priceJson = await priceText.jsonValue();
        appartement.price = Util.trimPrice(priceJson);

        // Get net price
        const [net_price] = await page.$x('//*[@id="financieel-page"]/div[1]');
        const net_priceText = await net_price.getProperty('innerText');
        const net_priceJson = await net_priceText.jsonValue();
        appartement.price_net = Util.trimPrice(net_priceJson);

        // Get allowance price
        const [allowance_price] = await page.$x('//*[@id="financieel-page"]/div[4]');
        const allowance_priceText = await allowance_price.getProperty('innerText');
        const allowance_priceJson = await allowance_priceText.jsonValue();
        appartement.price_allowance = Util.trimPrice(allowance_priceJson);

        // Get drawing date
        const [drawing] = await page.$x('//*[@id="main-info-page"]/div[4]');
        const drawingText = await drawing.getProperty('innerText');
        const drawingJson = await drawingText.jsonValue();
        appartement.drawingdate = Util.convertOnshuisDateTime(drawingJson);

        // Get appartment image href
        const [imagehref] = await page.$x('//*[@id="carousel-gen_id_123"]/div/div/img');
        const src = await imagehref.getProperty('src');
        appartement.img_href = await src.jsonValue();

        await browser.close();

        return appartement;
    }
}

module.exports = Scraper;
