let minimist = require("minimist");
let fs=require("fs");
let pup=require("puppeteer");

//node webAutomation.js --url=https://www.hackerrank.com --config=config.json 

let args=minimist(process.argv);
let configJSON=fs.readFileSync(args.config,"utf-8");
let config=JSON.parse(configJSON);


async function run (){
let browser = await pup.launch({defaultViewport :null,
                                args:[
                                    "--start-maximized"
                                ],
                                headless:false
                                });
    
    
let pages= await browser.pages();
let page=pages[0];

await page.goto(args.url);

await page.waitForSelector("a[data-event-action='Login']");
await page.click("a[data-event-action='Login']");

await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
await page.click("a[href='https://www.hackerrank.com/login']");

//login with credentials
await page.waitForSelector("input[name='username']");
await page.type("input[name='username']",config.userid,{delay:50});

await page.waitForSelector("input[name='password']");
await page.type("input[name='password']",config.password,{delay:50});


await page.waitForSelector("button[type='submit'");
await page.click("button[type='submit'");

//enter competition section
await page.waitForSelector("a[href='/contests");
await page.click("a[href='/contests");

await page.waitForSelector("a[href='/administration/contests/']");
await page.click("a[href='/administration/contests/']");




await page.waitForSelector("a.backbone.block-center");
let curls= await page.$$eval("a.backbone.block-center",function(atags){
    let urls=[];
    for(let i=0;i< atags.length;i++)
    {
        let url=atags[i].getAttribute("href");
        urls.push(url);
    }
    return urls;
});

for (let i=0;i<curls.length;i++)
{
    curl=curls[i];
    let ctab=await browser.newPage(curl);
    await ctab.goto(args.url+curl);
    await ctab.bringToFront();
    await ctab.waitFor(1000);
    await ctab.waitForSelector("li[data-tab='moderators']");
    await ctab.click("li[data-tab='moderators']");
    //type moderator
    await ctab.waitFor(1000);
    for(let i=0;i<config.moderators.length;i++){
        await ctab.waitForSelector("input#moderator");
        await ctab.type("input#moderator",config.moderators[i],{delay:20});
        await ctab.keyboard.press("Enter");
        await ctab.waitFor(1000);
    }
    await ctab.close();
    
}
await browser.close();

}


run();
