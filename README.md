# Ikzoekeenhuisinenschede-scraper
NodeJS scraper using Puppeteer that searches for appartments on ikzoekeenhuisinenschede.nl between a certain price range and automatically applies to them

# How to use
1. Make sure you ran `npm install` on the `app`, `api` and `scraper` modules

2. Create a .env file at the root of the `scraper` module

3. Make sure it has the following variables:

```
PORT=3000 // Default API module port
EXECUTABLEPATH=C:/Program Files (x86)/Google/Chrome/Application/chrome.exe // Path to chrome
LOW=100.00 // Lower bound
HIGH=500.00 // Upper bound
BELOW=432,51 // Subsidiary price (Comma is intentional!!)
WOONPLAATS_USERNAME=username
WOONPLAATS_PASSWORD=password
DOMIJN_USERNAME=username
DOMIJN_PASSWORD=password
ONSHUIS_USERNAME=username
ONSHUIS_PASSWORD=password
```

4. Run all the modules seperately with `npm start`, (`app` module is optional)

5. Scraper will automatically search for appartments everyday at 6AM
