const puppeteer = require('puppeteer');
const Util = require('./util');

class checker {
    async checkWoonplaats(appartment){
        const browser = await puppeteer.launch({executablePath: process.env.EXECUTABLEPATH});
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        const url = new URL(appartment.href).origin;

        const appartment_adress = Util.convertWoonplaatsAdress(appartment.adress);

        await page.goto(url);

        // Click on Mijn woonplaats and wait for redirect
        await Promise.all([
            page.$eval( '#mainmenu > div > div.mijnwoonplaats > a', button => button.click()),
            page.waitForNavigation({waitUntil: "networkidle2"})
        ]);

        // username field
        await page.$eval('#login_login', (el, value) => el.value = value, process.env.WOONPLAATS_USERNAME);

        // password field
        await page.$eval('#login_password', (el, value) => el.value = value, process.env.WOONPLAATS_PASSWORD);

        // Click on login and wait for page refresh
        await Promise.all([
            page.$eval( '#login_form > form > div.fieldgroup.separator > span:nth-child(2) > input', button => button.click()),
            page.waitForNavigation({waitUntil: "networkidle2"})
        ]);

        // Click on Mijn WoonVinder and wait for redirect
        await Promise.all([
            page.$eval( '#contentcolumn > div > a:nth-child(2)', button => button.click()),
            page.waitForNavigation({waitUntil: "networkidle2"})
        ]);

        const results = await page.$$('.resultblock');

        for (let i = 0; i < results.length; i++) {
            const adressEl = await results[i].$('.street');
            const adress = await (await adressEl.getProperty('innerText')).jsonValue();

            if (adress === appartment_adress){
                const statusEl = await results[i].$('div > div.leftcolumn > div > span > div > span');
                const status = await (await statusEl.getProperty('innerText')).jsonValue();

                if(status === "Wacht op loting"){
                    console.log(appartment_adress + " hasn't been drawn yet.");
                } else {
                    const resultEl = await results[i].$('div > div.data.stack_if_mobile.rightcolumn > span');
                    const result = await (await resultEl.getProperty('innerText')).jsonValue();
                    appartment.drawing_rank = Util.convertWoonplaatsResult(result);
                    console.log(appartment_adress + " has been drawed at ranking " + appartment.drawing_rank);
                }
            }
        }
        await browser.close();

        return appartment;
    }

    async checkDomijn(appartment){
        const browser = await puppeteer.launch({executablePath: process.env.EXECUTABLEPATH});
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        const url = new URL(appartment.href).origin;

        await page.goto(url);

        // Click on Mijn Domijn and wait for redirect
        await Promise.all([
            page.$eval( '#navigation > ul > li:nth-child(6) > nav > a', button => button.click()),
            page.waitForNavigation({waitUntil: "networkidle2"})
        ]);

        // username field
        await page.$eval('#Email', (el, value) => el.value = value, process.env.DOMIJN_USERNAME);

        // password field
        await page.$eval('#Password', (el, value) => el.value = value, process.env.DOMIJN_PASSWORD);

        // Click on Inloggen and wait for redirect
        await Promise.all([
            page.$eval( '#loginButton', button => button.click()),
            page.waitForNavigation({waitUntil: "networkidle2"})
        ]);

        // Click on Reactieoverzicht and wait for redirect
        await Promise.all([
            page.$eval( '#content-anchor > div > div.o-module.widgets > div > div.o-widget.c-widget.column-element.reactions > a', button => button.click()),
            page.waitForNavigation({waitUntil: "networkidle2"})
        ]);

        const results = await page.$$('#content-anchor > div > div:nth-child(2) > table > tbody > tr');

        for (let i = 0; i < results.length; i++) {
            const adressEl = await results[i].$('th > p');
            const adress = await (await adressEl.getProperty('innerText')).jsonValue();

            const appartmentAdressTrimmed = Util.convertDomijnAdress(appartment.adress);
            const adressTrimmed = adress.substring(0, appartmentAdressTrimmed.length);

            if(appartmentAdressTrimmed === adressTrimmed){
                const statusEl = await results[i].$('td:nth-child(4) > span');
                const status = await (await statusEl.getProperty('innerText')).jsonValue();

                if(status === "Volgt"){
                    console.log(appartment.adress + " hasn't been drawn yet.");
                } else {
                    appartment.drawing_rank = status;
                }
                return appartment;
            }
        }

        await browser.close();

        return appartment;
    }
}

module.exports = checker;
