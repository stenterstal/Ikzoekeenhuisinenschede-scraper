const puppeteer = require("puppeteer");

class Applier {
    async applyWoonplaats(appartment){
        const browser = await puppeteer.launch({executablePath: process.env.EXECUTABLEPATH});
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        console.log("Applying to " + appartment.adress);

        await page.goto(appartment.href);

        // Click on login
        const [loginRedirectBttn] = await page.$x('//*[@id="menucolumn"]/div/p[3]/a');
        await loginRedirectBttn.click();

        // username field
        await page.$eval('#login_login', (el, value) => el.value = value, process.env.WOONPLAATS_USERNAME);

        // password field
        await page.$eval('#login_password', (el, value) => el.value = value, process.env.WOONPLAATS_PASSWORD);

        // Click on login and wait for page refresh
        await Promise.all([
            page.$eval( '#login_form > form > div.fieldgroup.separator > span:nth-child(2) > input', button => button.click()),
            page.waitForNavigation({waitUntil: "networkidle2"})
        ]);

        // Click on react button
        await page.$eval( '#menucolumn > div > p:nth-child(3) > a', button => button.click());

        // Click on im sure button
        await page.$eval( '#dlg_replywp > div > div > p:nth-child(3) > a.actionbutton.woonvinderreplylink', button => button.click());

        await browser.close();
    }

    async applyDomijn(appartment){
        const browser = await puppeteer.launch({executablePath: process.env.EXECUTABLEPATH});
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        console.log("Applying to " + appartment.adress);

        await page.goto(appartment.href);

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

        await page.goto(appartment.href);

        await Promise.all([
            page.$eval( '#react-submit_01', button => button.click()),
            page.waitForNavigation({waitUntil: "networkidle2"})
        ]);

        await browser.close();
    }

    async applyOnshuis(appartment){
        const browser = await puppeteer.launch({executablePath: process.env.EXECUTABLEPATH});
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        console.log("Applying to " + appartment.adress);

        await page.goto(appartment.href);

        // Click on login and wait for redirect
        await Promise.all([
            page.$eval( '#mainBody > div.container > div > div > div > div.grid-component.row._variant_0 > div.grid-column-component.col-sm-6.textColor.grid-column-2 > div:nth-child(1) > a:nth-child(1)', button => button.click()),
            page.waitForNavigation({waitUntil: "networkidle2"})
        ]);

        // username field
        await page.$eval('#Username', (el, value) => el.value = value, process.env.ONSHUIS_USERNAME);

        // password field
        await page.$eval('#Password', (el, value) => el.value = value, process.env.ONSHUIS_PASSWORD);

        // Click on login and wait for redirect
        await Promise.all([
            page.$eval( '#mainBody > div.container > div > div > div > div.grid-component.row._variant_0 > div.grid-column-component.col-sm-6.textColor.grid-column-2.login-page > div > form > div.app-form-submit-component > div > div > button', button => button.click()),
            page.waitForNavigation({waitUntil: "networkidle2"})
        ]);

        await browser.close();
    }
}

module.exports = Applier;
