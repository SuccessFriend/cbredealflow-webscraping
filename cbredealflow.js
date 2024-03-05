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

    console.log("result >>> ", link_list.length, link_list);

    for (let i = 0; i < link_list.length; i++) {
        console.log("---------- ", i, " ----------");
        const link = link_list[i];
        console.log(link);

        await page.goto(link, {
            timeout: 300000
        });

        await delay(2000);
        
        try {
            await page.evaluate(() => {
                const doc_down_btn = document.querySelector("#download");
                doc_down_btn.click();
            });
        } catch (error) {
            
        }

        // await delay(2000);
        let signup_link = "";
        signup_link = await page.evaluate(() => {
            try {
                const agreement_btn = document.querySelectorAll("#btnConfi > a");
                const target_link = agreement_btn[agreement_btn.length - 1].getAttribute('href');
                if (target_link != null) {
                    return target_link;
                }
            } catch (error) {

            }
                
            try {
                const agreement_btn = document.querySelectorAll(".btn-bar > a");
                const target_link = agreement_btn[agreement_btn.length - 1].getAttribute('href');
                if (target_link != null) {
                    return target_link;
                }
            } catch (error) {
                
            }
            try {
                const access_data_btn = document.querySelector(".links > a");
                const target_link = access_data_btn.getAttribute('href');
                if (target_link != null) {
                    return target_link;
                }
            } catch (error) {
                
            }
        });
        if (signup_link) {
            console.log("Signup page...");
            signup_link = 'https://www.cbredealflow.com' + signup_link;
            console.log(signup_link);
            await page.goto(signup_link, { timeout: 300000 });
    
            try {
                await delay(6000);
                const fname_path = '#firstNameProfile';
                await page.waitForSelector(fname_path, { timeout: 3000});
                await page.type(fname_path, "Callie");
        
                const lname_path = '#lastNameProfile';
                await page.waitForSelector(lname_path, { timeout: 3000});
                await page.type(lname_path, "Muller");
                
                const email_path = '#emailProfile';
                await page.waitForSelector(email_path, { timeout: 3000});
                await page.type(email_path, "candice18@hotmail.com");
        
                await page.evaluate(() => {
                    const check_path = document.querySelector('label.custom-control-label');
                    check_path.click();
                });
                
                await page.evaluate(() => {
                    const submit_path = document.querySelector('#sendProfile');
                    submit_path.click();
                });
                console.log("Submit success...");
            } catch (error) {
                console.log("No singup page!");
            }
            try {
                await delay(8000);
                
                const company_classname = await page.evaluate(() => {
                    const classname = document.querySelector("#company").getAttribute("class");
                    return classname;
                })
                
                if (company_classname.includes("ng-invalid")) {
                    console.log("no company data...");
                    const company_path = '#company';
                    await page.waitForSelector(company_path, { timeout: 3000});
                    await page.type(company_path, "Marvin-Schinner");
    
                    const address_path = '#address';
                    await page.waitForSelector(address_path, { timeout: 3000});
                    await page.type(address_path, "70686 Litzy Lock");
                    
                    const city_path = '#city';
                    await page.waitForSelector(city_path, { timeout: 3000});
                    await page.type(city_path, "South Vicenta");
                    
                    const zip_path = '#zip';
                    await page.waitForSelector(zip_path, { timeout: 3000});
                    await page.type(zip_path, "21767");
                    
                    const phone_path = '#phone';
                    await page.waitForSelector(phone_path, { timeout: 3000});
                    await page.type(phone_path, "781.674.0643");
                } else {
                    console.log("exist company data...");
                }
                
                await page.evaluate(() => {
                    const eAgree_path = document.querySelector("#eAgreement");
                    eAgree_path.click();
                });
                await page.evaluate(() => {
                    const terms_path = document.querySelector("#termsLbl");
                    terms_path.click();
                });
                await page.evaluate(() => {
                    const agree_btn = document.querySelector("#agreeButton");
                    agree_btn.click();
                });
                await delay(10000);
                await page.evaluate(() => {
                    const modal_btn = document.querySelector("div.modal-buttons > span > a");
                    modal_btn.click();
                });
                await delay(10000);
                await page.evaluate(() => {
                    const select_all_btn = document.querySelector("#k-grid0-select-all");
                    select_all_btn.click();
                });
                await delay(2000);
                await page.evaluate(() => {
                    const download_btn = document.querySelector("button.vdr-download-button");
                    download_btn.click();
                });
                await delay(2000);
                await page.evaluate(() => {
                    const download_check_btn = document.querySelector("#btnProcOkay");
                    download_check_btn.click();
                });
                await delay(6000);
                console.log("download success...");
                
            } catch (error) {
                console.log("No download button!");
            }
        } else {
            continue;
        }
    
    }
        
    await browser.close();
    
}

scrapFunction();