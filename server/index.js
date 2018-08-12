
const Koa = require('koa');
const views = require('koa-views');
const { resolve } = require('path');
const app = new Koa();

app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}));

app.use(async (ctx) => {
  await ctx.render('index', {
    you: 'chace',
    me: 'xie',
  });
});

app.listen(4455);
