
const Koa = require('koa');
const views = require('koa-views');
const { resolve } = require('path');
const { connect, initSchemas } = require('./database/init');
const app = new Koa();

(async() => {
  await connect();
  initSchemas();

  const mongoose = require('mongoose');
  const Movie = mongoose.model('Movie');
  const movies = Movie.find({});
  console.log('index', movies);
})();

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
