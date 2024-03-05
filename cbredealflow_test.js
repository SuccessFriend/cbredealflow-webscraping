const puppeteer = require('puppeteer');

// Delay function
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapFunction() {

    const browser = await puppeteer.launch({
        headless: false,
        // args: ['--incognito'],
        args: ['--incognito', '--start-maximized'],
    });

    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});

    await page.goto('https://www.cbredealflow.com/', {
        timeout: 500000
    });

    await delay(3000);

    let link_list = [];
    for (let i = 0; i < 76; i++) {
        await delay(6000);
        const card_list = await page.$$(".summary");
        for( let card of card_list ) {
            const attr = await page.evaluate(el => el.getAttribute("href"), card);
            // console.log("attr >>> ", attr);
            if (attr != null) {
                link_list.push(attr);
            }
        }
        await page.evaluate(() => {
            const next_btn = document.querySelector("#rcmPagingNext");
            next_btn.click();
        })
        
    }

    console.log("result >>> ", link_list.length);

    for (let i = 0; i < link_list.length; i++) {
        console.log("---------- ", i, " ----------");
        const link = link_list[i];
        console.log(link);

        await page.goto(link, {
            timeout: 300000
        });

        await delay(4000);
        
        try {
            await page.evaluate(() => {
                const doc_down_btn = document.querySelector("#download");
                doc_down_btn.click();
            });
        } catch (error) {
            
        }
    
    }
        
    await browser.close();
    
}

scrapFunction();