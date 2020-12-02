const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const Scraper = require('./scraper');
const Applier = require('./applier');
const Checker = require('./checker');

const scraper = new Scraper();

const max_allowance = '432,51';

const CronJob = require('cron').CronJob;
const job = new CronJob('0 6 * * *', function () {
    Main();
});
job.start();

async function Main(){
    const now = new Date();
    console.log('\n===============================================');
    console.log('         Starting scrape for ' + now.getUTCFullYear() + '-' + (now.getUTCMonth()+1) + '-' + now.getDate());
    console.log('===============================================\n');

    const links = await scraper.scrapeMain(100.00, 500.00);

    const appartments = await scrapeLinks(links);

    const found = await filterAppartments(appartments, max_allowance);

    await addFoundToDatabase(found);

    await applyToAppartments();

    await getDrawingResults();
}

async function scrapeLinks(links){
    const appartments = [];
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const domain = new URL(link).hostname;
        let appartment;
        switch (domain) {
            case 'www.domijn.nl':
                appartment = await scraper.scrapeDomijn(link);
                appartment.supplier = "domijn";
                break;
            case 'www.dewoonplaats.nl':
                appartment = await scraper.scrapeWoonplaats(link);
                appartment.supplier = "dewoonplaats";
                break;
            case 'mijn.onshuis.com':
                appartment = await scraper.scrapeOnshuis(link);
                appartment.supplier = "onshuis";
                break;
        }
        appartments.push(appartment);
    }

    return appartments;
}

async function filterAppartments(appartments, max_allowance){
    const found = [];

    for (let i = 0; i < appartments.length; i++) {
        const appartment = appartments[i];
        if(appartment.price_allowance <= max_allowance){
            found.push(appartment);
        }
    }

    if(found.length === 0){
        console.log("\nFound no appartments valid for allowance");
    } else {
        console.log("\nFound " + found.length + " appartment(s) valid for allowance" + found.length>0?'\n':'');
    }
    return found;
}

async function addFoundToDatabase(appartments){
    if(appartments.length === 0){
        return;
    }

    for (let i = 0; i < appartments.length; i++) {
        const appartment = appartments[i];
        const response = await axios.post('http://localhost:' + process.env.PORT + '/appartments', {appartment: appartment});
        console.log(response.data);
    }
}

async function applyToAppartments(){
    const applier = new Applier();
    const appartments = await axios.get('http://localhost:' + process.env.PORT + '/appartments/unresponded').then(function (response) {
        return response.data;
    });

    if(appartments.length === 0){
        return;
    }

    console.log("\nApplying for " + appartments.length + " appartment(s)\n");

    for (let i = 0; i < appartments.length; i++) {
        const appartment = appartments[i];
        switch (appartment.supplier) {
            case "dewoonplaats":
                await applier.applyWoonplaats(appartment);
                await axios.put('http://localhost:' + process.env.PORT + '/appartments/responded', {appartment: appartment});
                break;
            case "domijn":
                await applier.applyDomijn(appartment);
                await axios.put('http://localhost:' + process.env.PORT + '/appartments', {appartment: appartment});
                break;
            case "onshuis":
                await applier.applyOnshuis(appartment);
                await axios.put('http://localhost:' + process.env.PORT + '/appartments', {appartment: appartment});
                break;
        }
        console.log("Applied for " + appartment.adress + " (" + appartment.href + ")");
    }
}

async function getDrawingResults(){
    const appartments = await axios.get('http://localhost:' + process.env.PORT + '/appartments/drawed').then(function (response) {
        return response.data;
    });

    if(appartments.length === 0){
        return;
    }

    console.log("\nChecking results for " + appartments.length + " appartment(s)\n");

    for (let i = 0; i < appartments.length; i++) {
        let appartment = appartments[i];
        const domain = new URL(appartment.href).hostname;

        const checker = new Checker();

        console.log("Checking result for " + appartment.adress);

        switch (domain) {
            case 'www.domijn.nl':
                appartment = await checker.checkDomijn(appartment);
                break;
            case 'www.dewoonplaats.nl':
                appartment = await checker.checkWoonplaats(appartment);
                break;
            case 'mijn.onshuis.com':
                // Onshuis doesn't give results on their website, set drawing rank to -1
                appartment.drawing_rank = -1;
                break;
        }

        if(appartment.drawing_rank !== null){
            await axios.put('http://localhost:' + process.env.PORT + '/appartments/rank', {appartment: appartment});
            // TODO: Do something with result, maybe send mail or phone notification?
        }
    }
}
