
const cp = require('child_process');
const { resolve } = require('path');
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
const Category = mongoose.model('Category');

(async () => {

  const movies = await Movie.find({
    $or: [
      { video: { $exists: false } },
      { video: null }
    ]
  });

  const script = resolve(__dirname, '../crawler/video');
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

  child.on('message', async data => {
    const { doubanId } = data;
    const movie = await Movie.findOne({ doubanId });
    if (data.video) {
      movie.video = data.video;
      movie.cover = data.cover;
      await movie.save();
    } else {
      await movie.remove();

      const { movieTypes } = movie;
      for (let i = 0; i < movieTypes.length; i++) {
        const type = movieTypes[i];
        const cat = Category.findOne({
          name: type,
        });
        if (cat && cat.movies) {
          const idx = cat.movies.indexOf(movie._id);
          if (idx > -1) {
            cat.movies = cat.movies.splice(idx, 1);
          }
          await cat.save();
        }
      }

    }
  });

  child.send(movies);
})();
