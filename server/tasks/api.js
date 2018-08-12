
const rp = require('request-promise-native');

async function fetchMovie (item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`;
  const res = await rp(url);
  return res;
}

(async () => {

  const movies = [];

  movies.map(async movie => {
    const movieData = await fetchMovie(movie);
    console.log('movieData', movieData);
  });

})();
