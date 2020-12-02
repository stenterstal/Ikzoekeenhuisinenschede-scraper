const Database = require('./database');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const database = new Database();

app.use(cors());

app.use(bodyParser.json())

app.get('/appartments', async (req, res) => {
    console.log("GET /appartments");
    const appartments = await database.getAppartments();
    res.send(appartments);
});

app.get('/appartments/unresponded', async (req, res) => {
    console.log("GET /appartments/unresponded");
    const appartments = await database.selectUnrespondedAppartments();
    res.send(appartments);
});

app.get('/appartments/drawed', async (req, res) => {
    console.log("GET /appartments/drawed");
    const appartments = await database.selectDrawedAppartmentsWithoutRanking();
    res.send(appartments);
});

app.post('/appartments', async (req, res) => {
    console.log("POST /appartments");
    const appartment = req.body.appartment;
    const result = await database.insertAppartment(appartment);
    console.log(result);
    res.send(result);
});

app.put('/appartments/responded', async (req, res) => {
    console.log("PUT /appartments/responded");
    const appartment = req.body.appartment;
    await database.setAppartmentResponded(appartment);
    res.send(204);
});

app.put('/appartments/rank', async (req, res) => {
    console.log("PUT /appartments/rank");
    const appartment = req.body.appartment;
    await database.setAppartmentDrawingrank(appartment);
    res.send(204);
});

app.put('/appartments/viewed', async (req, res) => {
    console.log("PUT /appartments/viewed");
    await database.setAllNewAppartmentsViewed();
    res.send(204);
});

app.listen(port, () => {
    console.log("Api is listening at port " + port);
});
