const sqlite = require('sqlite3').verbose();

class Database {
    constructor() {
        this.db = this.createDatabase();

        this.createTableIfNotExists();
    }

    createDatabase(){
        return new sqlite.Database('appartments.db', (err) => {
            if(err){
                return console.log("Error connecting to database: " + err);
            }

            console.log("Connected to SQLite Database");
        });
    }

    createTableIfNotExists(){
        this.db.exec(`CREATE TABLE IF NOT EXISTS appartments (
                supplier        VARCHAR,
                adress          VARCHAR  NOT NULL,
                price           DOUBLE   NOT NULL,
                price_net       DOUBLE   NOT NULL,
                price_allowance DOUBLE   NOT NULL,
                drawingdate     DATETIME NOT NULL,
                href            VARCHAR  NOT NULL,
                img_href        VARCHAR  NOT NULL,
                responded       BOOLEAN  DEFAULT (false) 
                                         NOT NULL,
                new             BOOLEAN  NOT NULL
                                         DEFAULT (true),
                drawing_rank    INTEGER,
                PRIMARY KEY (
                    supplier,
                    adress,
                    drawingdate
                )
            );`
        );
    }

    insertAppartment(appartment){
        return new Promise(((resolve, reject) => {
            this.db.run(`INSERT INTO appartments (supplier, adress, price, price_net, price_allowance, drawingdate, href, img_href, responded) VALUES(?,?,?,?,?,?,?,?,?)`,
                [appartment.supplier, appartment.adress, appartment.price, appartment.price_net, appartment.price_allowance, appartment.drawingdate, appartment.href, appartment.img_href, "false"],
                function (err) {
                    if(err){
                        resolve("Appartment " + appartment.adress + " is already present in database.");
                    }
                    resolve("Added appartment " + appartment.adress + " to database");
                });
        }))
    }

    async selectUnrespondedAppartments(){
        return new Promise(((resolve, reject) => {
            this.db.all(`SELECT * FROM appartments WHERE responded="false"`, (err, appartments) => {
                if(err){
                    throw new Error("Error querying appartments from database");
                }

                resolve(appartments);
            });
        }))
    }

    async setAppartmentResponded(appartment){
        return new Promise(((resolve, reject) => {
            this.db.run(`UPDATE appartments SET responded="true" WHERE adress=? AND drawingdate=?`, [appartment.adress, appartment.drawingdate], function (err) {
                if(err){
                    throw new Error("Error updating appartment " + appartment.adress + " in database");
                }
                resolve();
            })
        }))
    }

    async selectDrawedAppartmentsWithoutRanking(){
        return new Promise(((resolve, reject) => {
            const date = new Date();
            const month = date.getMonth()+1;
            const dateString = date.getFullYear() + '-' + ((month<10?'0':'')+month) + '-' + ((date.getDate()<10?'0':'')+date.getDate()) + ' ' + (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
            this.db.all(`SELECT * FROM appartments WHERE drawingdate < ? AND drawing_rank IS NULL;`, [dateString], function (err, appartments) {
                if(err){
                    throw new Error("Error querying appartments without results and drawing date before now");
                }
                resolve(appartments);
            })
        }))
    }

    async setAppartmentDrawingrank(appartment){
        return new Promise(((resolve, reject) => {
            this.db.run(`UPDATE appartments SET drawing_rank=? WHERE adress=?`, [appartment.drawing_rank, appartment.adress], function (err) {
                if(err){
                    throw new Error("Error updating appartment " + appartment.adress + " in database");
                }
                resolve();
            })
        }))
    }

    async setAllNewAppartmentsViewed(){
        return new Promise(((resolve, reject) => {
            this.db.run(`UPDATE appartments SET new="false" WHERE new="true"`, function (err) {
                if(err){
                    throw new Error("Error updating appartment " + appartment.adress + " in database");
                }
                resolve();
            })
        }))
    }

    async getAppartments(){
        return new Promise(((resolve, reject) => {
            this.db.all(`SELECT * FROM appartments`, function (err, appartments) {
                if(err){
                    throw new Error("Error querying appartments");
                }
                resolve(appartments);
            })
        }))
    }
}

module.exports = Database;
