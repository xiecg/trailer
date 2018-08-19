
const mongoose = require('mongoose');
const glob = require('glob');
const { resolve } = require('path');
const db = 'mongodb://localhost/trailer';
const dbConfig = {
  useNewUrlParser: true,
}

mongoose.Promise = global.Promise;

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require);
}

exports.connect = () => {

  let maxConnectTimes = 0;

  return new Promise((resolve, reject) => {

    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
      }
    
      mongoose.connect(db, dbConfig);
    
      mongoose.connection.on('disconnected', () => {
        maxConnectTimes++;
        if (maxConnectTimes < 5) {
          mongoose.connect(db, dbConfig);
        } else {
          throw new Error('db error.');
        }
      });
    
      mongoose.connection.on('error', err => {
        maxConnectTimes++;
        if (maxConnectTimes < 5) {
          mongoose.connect(db, dbConfig);
        } else {
          throw new Error('db error.');
        }
      });
    
      mongoose.connection.once('open', () => {
        resolve();
        console.log('MongoDB Connected successfully!');
      });
  });
};