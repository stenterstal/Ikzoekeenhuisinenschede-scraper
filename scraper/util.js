class Util {
    /**
     * Converts a price string with currency symbol to a price float
     * @param {object} price Untrimmed price string
     * @returns {string} price
     */
    static trimPrice(price) {
        return price.replace(/[^\d,-]/g,'');
    }

    static trimWoonplaatsAdress(adress){
        return adress.split('\n')[1];
    }

    static convertDomijnDateTime(dateTimeString){
        let day = dateTimeString.split('-')[0];
        let month = dateTimeString.split('-')[1];
        let year = dateTimeString.split('-')[2].split(' ')[0];
        let time = dateTimeString.split('-')[2].split(' ')[1];
        return (year + "-" + ((month < 10 ? '0' : '')+month) + "-" + ((day < 10 ? '0' : '')+day) + " " + time);
    }

    static convertDomijnAdress(adress){
        let trimmed = adress.split('-')[0];
        return trimmed.substring(0, trimmed.length-2);
    }

    static convertWoonplaatsDateTime(dateTimeString){
        const months = ["januari", "februari", "maart", "april", "mei", "juni", "juli",
        "augustus", "september", "oktober", "november", "december"];

        let day = dateTimeString.split(' ')[2];
        let month = months.indexOf(dateTimeString.split(' ')[3])+1;
        let year = dateTimeString.split(' ')[4];
        let time = dateTimeString.split(' ')[5];
        return (year + '-' + ((month < 10 ? '0' : '')+month) + '-' + ((day < 10 ? '0' : '')+day) + ' ' + time);
    }

    static convertOnshuisDateTime(dateTimeString){
        const months = ["januari", "februari", "maart", "april", "mei", "juni", "juli",
            "augustus", "september", "oktober", "november", "december"];

        let day = dateTimeString.split(' ')[0];
        let month = months.indexOf(dateTimeString.split(' ')[1])+1;
        let time = dateTimeString.split(' ')[3];

        let today = new Date();
        let possibleDrawing = new Date(today.getFullYear(), month, day);
        let year = today.getFullYear();
        if(today > possibleDrawing){
            year++;
        }

        return (year + '-' + ((month < 10 ? '0' : '')+month) + '-' + ((day < 10 ? '0' : '')+day) + ' ' + time);
    }

    static convertWoonplaatsAdress(adress){
        return adress.split(',')[0];
    }

    static convertWoonplaatsResult(string){
        return string.split(':')[1].trim();
    }
}

module.exports = Util;
