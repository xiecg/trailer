
const cp = require('child_process');
const { resolve } = require('path');
const _ = require('lodash');
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');

(async () => {
  const script = resolve(__dirname, '../crawler/trailer-list.js');
  const child = cp.fork(script, []);

  let invoked = false;

  child.on('error', error => {
    if (invoked) {
      return false;
    } else {
      invoked = true;
      console.log('child error', error);
    }
  });

  child.on('exit', code => {
    if (invoked) {
      return false;
    } else {
      invoked = true;
      let err = code === 0 ? null : new Error(`exit code ${code}`);
      console.log('exit error', err);
    }
  });

  child.on('message', data => {
    const { result } = data;
    result.forEach(async item => {
      let movie = await Movie.find({
        doubanId: item.doubanId,
      });
      if (_.isEmpty(movie)) {
        movie = new Movie(item);
        await movie.save();
      }
    });
  });

})();
