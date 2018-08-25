
const puppeteer = require('puppeteer');
const base = 'https://movie.douban.com/subject/';

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time);
});

process.on('message', async movies => {
  console.log('start visit the target page.');

  const browser = await puppeteer.launch({
    args: ['-no-sandbox'],
    dumpio: false,
  });

  const page = await browser.newPage();

  for (let i = 0; i < movies.length; i++) {
    let { doubanId } = movies[i];
    await page.goto(base + doubanId, {
      waitUntil: 'networkidle2',
    });
  
    await sleep(1000);
  
    const result = await page.evaluate(() => {
      const { $ } = window;
      const it = $('.related-pic-video');
  
      if (it && it.length > 0) {
        const link = it.attr('href');
        const cover = it.css('background-image').split('\"')[1];
        // url("https://img1.doubanio.com/img/trailer/medium/2493603388.jpg?")
        // test.replace(/url\(\"(.*?)\"\)/ig, '$1');
        return { link, cover }
      }
  
      return {};
    });
  
    let video;
  
    if (result.link) {
      await page.goto(result.link, {
        waitUntil: 'networkidle2'
      });
      await sleep(2000);
  
      video = await page.evaluate(() => {
        var $ = window.$;
        var it = $('source');
  
        if (it && it.length > 0) {
          return it.attr('src');
        }
  
        return '';
      })
    }
    
    process.send({
      video,
      doubanId,
      cover: result.cover
    });

  }

  browser.close();
  process.exit(0);

});