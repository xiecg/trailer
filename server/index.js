
const Koa = require('koa');
const { resolve } = require('path');
const { connect, initSchemas, initAdmin } = require('./database/init');
const R = require('ramda');
const MIDDLEWARES = ['router', 'parcel'];

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES);
}

// var add = function(a, b) {return a + b};
// var numbers = [1, 2, 3, 4, 5];
// var sum = R.reduce(add, 0, numbers);

// console.log(sum);

// return;
(async() => {
  await connect();
  initSchemas();
  
  // await initAdmin();

  // require('./tasks/movie');
  // require('./tasks/api');
  // require('./tasks/trailer');
  // require('./tasks/qiniu');

  const app = new Koa();
  await useMiddlewares(app);

  app.listen(4455);
})();
